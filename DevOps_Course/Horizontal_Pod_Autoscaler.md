# Horizontal Pod Autoscaler
Kubernetes มีทรัพยากรประเภทหนึ่งที่เรียกว่า HorizontalPodAutoscaler หรือ HPA มีหน้าที่อัพเดทจำนวนของทรัพยากรประเภท Workload เช่น Deployment หรือ StatefulSet ให้มีจำนวนมากขึ้นหรือน้อยลงเพื่อให้ตรงตามค่าวัด (Metrics) ที่ได้กำหนดไว้

HorizontalPodAutoscaler มีรูปแบบการสเกลแบบ Horizontal Scaling กล่าวคือการทำงานของมันจะเป็นการเพิ่มจำนวน Pods เข้าไปในระบบ เพื่อให้ตรงกับค่าคาดหมาย กระบวนการนี้จะแตกต่างจากการทำงานแบบ Vertical Scaling ที่ Kubernetes จะทำการเพิ่มทรัพยากรประเภทหน่วยความจำหรือ CPU เข้าไปในระบบเพื่อขยายขนาดนั่นเอง

การทำงานของ HorizontalPodAutoscaler นั้นเมื่อพบว่าจำนวน Pods เกินกว่าค่าคาดหมายที่ได้กำหนดไว้แล้วจะทำการออกคำสั่งไปยัง Workload เหล่านั้น คือ Deployment หรือ StatefulSet เพื่อให้ทำการลดจำนวน Pods ในระบบลง

1. ติดตั้ง Metrics Server
เพื่อให้ HPA สามารถทำงานได้ บนระบบคลัสเตอร์ต้องทำการติดตั้ง Kubernetes Metrics Server เพื่อรวบรวมข้อมูลของ Metrics ต่าง ๆ จาก kubelet ในคลัสเตอร์ เราจึงจำเป็นต้องทำการติดตั้ง Metrics Server ผ่านการสร้างไฟล์ `k8s/hpa-components.yaml` ดังนี้

```yml
apiVersion: v1
kind: ServiceAccount
metadata:
  labels:
    k8s-app: metrics-server
  name: metrics-server
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  labels:
    k8s-app: metrics-server
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
    rbac.authorization.k8s.io/aggregate-to-view: "true"
  name: system:aggregated-metrics-reader
rules:
  - apiGroups:
      - metrics.k8s.io
    resources:
      - pods
      - nodes
    verbs:
      - get
      - list
      - watch
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  labels:
    k8s-app: metrics-server
  name: system:metrics-server
rules:
  - apiGroups:
      - ""
    resources:
      - nodes/metrics
    verbs:
      - get
  - apiGroups:
      - ""
    resources:
      - pods
      - nodes
    verbs:
      - get
      - list
      - watch
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  labels:
    k8s-app: metrics-server
  name: metrics-server-auth-reader
  namespace: kube-system
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: extension-apiserver-authentication-reader
subjects:
  - kind: ServiceAccount
    name: metrics-server
    namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  labels:
    k8s-app: metrics-server
  name: metrics-server:system:auth-delegator
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:auth-delegator
subjects:
  - kind: ServiceAccount
    name: metrics-server
    namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  labels:
    k8s-app: metrics-server
  name: system:metrics-server
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: system:metrics-server
subjects:
  - kind: ServiceAccount
    name: metrics-server
    namespace: kube-system
---
apiVersion: v1
kind: Service
metadata:
  labels:
    k8s-app: metrics-server
  name: metrics-server
  namespace: kube-system
spec:
  ports:
    - name: https
      port: 443
      protocol: TCP
      targetPort: https
  selector:
    k8s-app: metrics-server
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    k8s-app: metrics-server
  name: metrics-server
  namespace: kube-system
spec:
  selector:
    matchLabels:
      k8s-app: metrics-server
  strategy:
    rollingUpdate:
      maxUnavailable: 0
  template:
    metadata:
      labels:
        k8s-app: metrics-server
    spec:
      containers:
        - args:
            - --cert-dir=/tmp
            - --secure-port=10250
            - --kubelet-preferred-address-types=InternalIP,ExternalIP,Hostname
            - --kubelet-use-node-status-port
            - --metric-resolution=90s
            - --kubelet-insecure-tls
          image: registry.k8s.io/metrics-server/metrics-server:v0.7.0
          imagePullPolicy: IfNotPresent
          livenessProbe:
            failureThreshold: 3
            httpGet:
              path: /livez
              port: https
              scheme: HTTPS
            periodSeconds: 10
          name: metrics-server
          ports:
            - containerPort: 10250
              name: https
              protocol: TCP
          readinessProbe:
            failureThreshold: 3
            httpGet:
              path: /readyz
              port: https
              scheme: HTTPS
            initialDelaySeconds: 20
            periodSeconds: 10
          resources:
            requests:
              cpu: 100m
              memory: 200Mi
          securityContext:
            allowPrivilegeEscalation: false
            capabilities:
              drop:
                - ALL
            readOnlyRootFilesystem: true
            runAsNonRoot: true
            runAsUser: 1000
            seccompProfile:
              type: RuntimeDefault
          volumeMounts:
            - mountPath: /tmp
              name: tmp-dir
      nodeSelector:
        kubernetes.io/os: linux
      priorityClassName: system-cluster-critical
      serviceAccountName: metrics-server
      volumes:
        - emptyDir: {}
          name: tmp-dir
---
apiVersion: apiregistration.k8s.io/v1
kind: APIService
metadata:
  labels:
    k8s-app: metrics-server
  name: v1beta1.metrics.k8s.io
spec:
  group: metrics.k8s.io
  groupPriorityMinimum: 100
  insecureSkipTLSVerify: true
  service:
    name: metrics-server
    namespace: kube-system
  version: v1beta1
  versionPriority: 100

```
จากนั้นให้ออกคำสั่ง `kubectl apply -f k8s/hpa-components.yaml `เพื่อใช้งาน

2. การเรียกใช้งาน HPA
เพื่อให้ HPA กำหนดการขยายจำนวน Pods ได้ตามสัดส่วนการใช้งาน CPU เราต้องทำการเพิ่มส่วนของ `resources/requests` ใน Pod เพื่อเป็นตัวกำหนดว่าแต่ละ Pod จำเป็นต้องมีทรัพยากรใดจำนวนเท่าไหร่เพื่อให้เพียงพอต่อการใช้งาน พร้อมกันนี้เราจะทำการกำหนด replicas ให้มีขนาดเพียง 1 ส่วนที่เหลือจพอาศัยการสเกลจาก HPA แทน แก้ไขโค้ดต่อไปนี้ใน `k8s/deployment.yaml`

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: site
  labels:
    app: site
spec:
# --------------------
  replicas: 1
# --------------------
  selector:
    matchLabels:
      app: site
  template:
    metadata:
      labels:
        app: site
    spec:
      containers:
        - name: site
          image: babelcoder/intro-to-devops-ui:1.0
          resources:
            limits:
              memory: "200Mi"
              cpu: "200m"
# --------------------
            requests:
              memory: "100Mi"
              cpu: "100m"
# --------------------

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  labels:
    app: api
spec:
# --------------------
  replicas: 1
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: babelcoder/intro-to-devops-api:1.0
          env:
            - name: DATABASE_URL
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: databaseUrl
            - name: PORT
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: port
            - name: APP_ENV
              valueFrom:
                configMapKeyRef:
                  name: api-config
                  key: env
          resources:
            limits:
              memory: "200Mi"
              cpu: "200m"
# --------------------
            requests:
              memory: "100Mi"
              cpu: "100m"
# --------------------

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: db
  labels:
    app: db
spec:
# --------------------
  replicas: 1
# --------------------
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
        - name: db
          image: redis:7.2.4-alpine
          resources:
            limits:
              memory: "200Mi"
              cpu: "200m"
# --------------------
            requests:
              memory: "100Mi"
              cpu: "100m"
# --------------------
```
เมื่อเสร็จเรียบร้อยเราจะออกคำสั่งต่อไปนี้เพื่อสร้าง HPA ที่มีการทำงานคือการกำหนดจำนวน Pods ขั้นต่ำที่ 1 Pods และสูงสุดถึง 5 Pods โดยการสเกลนั้นจะเพิ่มหรือลด Pods ขึ้นอยู่กับการพิจารณาสัดส่วนการใช้งาน CPU หากมีการใช้งาน CPU เฉลี่ยมากกว่า 20% จะทำการสเกลขึ้นด้วยการเพิ่มจำนวน Pods และจะลดจำนวน Pods ลงเมื่อการใช้งาน CPU เฉลี่ยต่ำกว่า 50% ในระดับหนึ่ง ในที่นี้เราจะสร้าง HPA เพื่อใช้งานกับ Deployment ที่มีชื่อว่า api เท่านั้น

```bash
$ kubectl autoscale deployment api --cpu-percent=20 --min=1 --max=5

horizontalpodautoscaler.autoscaling/api autoscaled
```
ทำการตรวจสอบ HPA ที่สร้างผ่านคำสั่ง `kubectl get hpa `ส่วนนี้จะพบกับคอลัมภ์ชื่อ TARGETS แสดงผลเป็น `1%/20%` ที่มีความหมายว่ามีการตั้งค่า Metrics ไว้ที่ 20% แต่ปัจจุบันการใช้งาน CPU เฉลี่ยนอยู่ที่ `1%`

```bash
$ kubectl get hpa

NAME   REFERENCE        TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
api    Deployment/api   1%/20%    1         5         1          17m
```

3. ทดลองเพิ่มและลดโหลดของ API
เราจะทำการเพิ่มโหลดเพื่อดูการทำงานของ HPA ว่าจะมีการเพิ่มจำนวน Pods เมื่อ CPU เฉลี่ยเกิน 20% หรือไม่ โดยออกคำสั่งสำหรับการเรียกใช้งาน API อย่างต่อเนื่อง ดังนี้

```bash
$ kubectl run -i --tty load-generator --rm --image=busybox:1.28 --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://api:5152/articles; done"
```
ทำการออกคำสั่งต่อไปนี้เพื่อสังเกตการใช้งาน CPU โดยเฉลี่ยว่าอยู่ที่ระดับใด

```bash
$ kubectl get hpa api --watch

NAME   REFERENCE        TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
api    Deployment/api   1%/20%    1         5         1          3s
api    Deployment/api   31%/20%   1         5         2          61s
```
จากคำสั่งข้างต้นเมื่อ CPU เฉลี่ยใช้งานถึง 31% เมื่อนั้น HPA จะทำการเพิ่มจำนวน Pod เป็น 2 ตัว

```bash
$ kubectl get deploy api -w

NAME   READY   UP-TO-DATE   AVAILABLE   AGE
api    2/2     2            2           6d5h
```
จากนั้นให้หยุดการทำงานของคำสั่งในการร้องขอข้อมูลจาก API ลง เพื่อให้การใช้งาน CPU เฉลี่ยลดลง ทำการสังเกตการใช้งาน CPU เมื่อเวลาผ่านไประยะหนึ่งจะพบผลลัพธ์ดังนี้

```bash
$ kubectl get hpa api --watch

NAME   REFERENCE        TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
api    Deployment/api   16%/20%   1         5         2          32m
api    Deployment/api   1%/20%    1         5         2          33m
```
เมื่อการใช้งานเฉลี่ยของ CPU แต่ระดับลง ให้กลับไปทำการสังเกตจำนวน Pods จะพบว่ามีจำนวนที่ลดลง

```bash
$ kubectl get deploy api -w

NAME   READY   UP-TO-DATE   AVAILABLE   AGE
api    1/1     1            1           6d5h
```
4. การตั้งค่าการทำงานของ HPA ผ่านไฟล์ YAML
เราจะเปลี่ยนรูปแบบการเรียกใช้ HPA จากเดิมที่เป็นการออกคำสั่งให้อยู่ในรูปแบบของไฟล์ YAML แทน

ให้ทำการลบ HPA ที่เคยสร้างไว้ผ่านคำสั่งทิ้งด้วยการออกคำสั่งต่อไปนี้

```bash
$ kubectl delete hpa api

horizontalpodautoscaler.autoscaling "api" deleted
```
ทำการสร้างไฟล์ชื่อ `k8s/hpa.yaml` ดังนี้

```yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 1
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 20
```
ทำการออกคำสั่งเพื่อสร้าง HPA

```bash
$ kubectl apply -f k8s/hpa.yaml
```
จากนั้นจึงทำซ้ำขึ้นตอนในหัวข้อที่ `3. ทดลองเพิ่มและลดโหลดของ API `เพื่อทดสอบการเพิ่มและลดของจำนวน Pods เมื่อการใช้งานเฉลี่ยของ CPU เปลี่ยนแปลงไป


