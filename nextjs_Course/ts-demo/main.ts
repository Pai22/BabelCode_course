type ButtonProps = {
    color: string,
    text: string | {toString: () => string}
} & ( // เชื่อมด้วยและ แล้วเลือกอย่างใดอย่างนึ่ง
    | { variant: "outline"; borderWidth?: number}
    | { variant: "contain"; opacity?: number}
    | { variant?: never} // ไม่ต้องส่ง variant เข้ามาก็ได้และไม่สามารถระบุค่าอื่นเข้ามาได้
)




function buildButton(props?: ButtonProps) {
    // build button
  }

  buildButton();
buildButton({ variant: 'contain', color: '#4466ee', text: 'hello' });
buildButton({ variant: 'contain', color: '#4466ee', opacity: 0.6, text: 20 });
buildButton({ variant: 'outline', color: '#4466ee', text: 'hi' });
buildButton({
  variant: 'outline',
  color: '#4466ee',
  borderWidth: 2,
  text: 'lorem',
});
const person = {
  firstName: 'Somchai',
  lastName: 'Somset',
  toString() {
    return `${this.firstName} ${this.lastName}`;
  },
};
buildButton({ color: '#55ee11', text: person });