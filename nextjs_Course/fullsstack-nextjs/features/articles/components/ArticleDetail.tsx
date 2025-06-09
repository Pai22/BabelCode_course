'use client';

import { type ArticleDetails } from '@/features/articles/types';
import Image from 'next/image';

interface ArticleDetailProps {
  article: ArticleDetails;
}

const ArticleDetail = ({
  article: { image, title, content },
}: ArticleDetailProps) => {
  return (
    <article>
      <div className="relative h-[500px]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 800px) 50vw, 100vw"
          className="object-cover"
        ></Image>
      </div>
      <h2 className="my-4 text-center text-4xl font-bold">{title}</h2>
      <p className="my-4 text-xl">{content}</p>
    </article>
  );
};
export default ArticleDetail;
