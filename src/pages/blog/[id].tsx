import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeUnwrapImages from "rehype-unwrap-images";

import DefaultLayout from "@/layouts/default";
import { getAllPostIds, getPostData, type PostData } from "@/lib/posts";

interface BlogPostProps {
  postData: PostData;
}

export default function BlogPost({ postData }: BlogPostProps) {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center gap-4 max-w-4xl mx-auto min-h-screen py-12 px-4">
        <Link
          href="/blog"
          className="self-start text-brand-500 hover:underline mb-4"
        >
          ← Back to blog
        </Link>

        <article className="w-full">
          <h1 className="sm:text-6xl text-5xl font-atirose text-brand-500 mb-4">
            {postData.title || "Untitled"}
          </h1>

          {postData.formattedDate && (
            <p className="text-gray-400 mb-8">{postData.formattedDate}</p>
          )}

          <div className="w-full my-4 mb-8">
            <svg
              className="w-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 330 8"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_453_22)">
                <path
                  d="M35 3L-0.5 7.5V12.5H330V7.5L294.5 3H271L242 0H87.5L58.5 3H35Z"
                  fill="transparent"
                />
                <path
                  d="M59.0303 3.5303L58.8107 3.75H58.5H35.3107L0.25 7.8107V11.75H329.25V7.8107L294.189 3.75H271H270.689L270.47 3.5303L241.689 0.75H87.8107L59.0303 3.5303Z"
                  stroke="#A986D9"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
              <defs>
                <clipPath id="clip0_453_22">
                  <rect fill="white" height="8" width="330" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
            <ReactMarkdown
              rehypePlugins={[rehypeUnwrapImages]}
              components={{
                p: ({ children }) => (
                  <p className="mb-4 text-base leading-relaxed">{children}</p>
                ),
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-white mb-4 mt-8 font-atirose">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-white mb-3 mt-6 font-atirose text-brand-500">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-white mb-2 mt-4">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-base leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-white">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-200">{children}</em>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-800 px-2 py-1 rounded text-sm font-mono text-brand-500">
                    {children}
                  </code>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-brand-500 hover:underline"
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-brand-500 pl-4 my-4 italic text-gray-400">
                    {children}
                  </blockquote>
                ),
                img: ({ src, alt, ...props }) => {
                  // Handle external URLs vs local paths
                  if (!src) return null;

                  const isExternal = src.startsWith("http");

                  // For external images, use regular img tag (Next.js can't optimize external URLs)
                  if (isExternal) {
                    // eslint-disable-next-line @next/next/no-img-element
                    return (
                      <figure className="my-6">
                        <img
                          src={src}
                          alt={alt || ""}
                          className="rounded-lg max-w-full h-auto"
                          {...props}
                        />
                      </figure>
                    );
                  }

                  // For local images, use Next.js Image optimization
                  // Images should be in /public/img/blog/ or any /public subfolder
                  // Accept both /img/blog/image.png and img/blog/image.png formats
                  const imagePath = src.startsWith("/") ? src : `/${src}`;

                  return (
                    <figure className="my-6 relative w-full aspect-video max-h-[600px]">
                      <Image
                        src={imagePath}
                        alt={alt || ""}
                        fill
                        className="rounded-lg object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                      />
                    </figure>
                  );
                },
              }}
            >
              {postData.content || ""}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </DefaultLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params || typeof params.id !== "string") {
    return {
      notFound: true,
    };
  }

  const postData = getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
};
