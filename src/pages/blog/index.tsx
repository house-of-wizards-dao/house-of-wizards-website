import { GetStaticProps } from "next";
import Link from "next/link";
import { Card } from "@nextui-org/card";

import DefaultLayout from "@/layouts/default";
import { getSortedPostsData, type Post } from "@/lib/posts";

interface BlogIndexProps {
  allPostsData: Post[];
}

export default function BlogIndex({ allPostsData }: BlogIndexProps) {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center gap-4 max-w-8xl min-h-screen py-12">
        <h1 className="sm:text-7xl text-6xl font-atirose text-brand-500">
          Blog
        </h1>

        <div className="w-full my-4">
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

        <div className="max-w-7xl flex flex-col gap-6 sm:p-0 p-4">
          {allPostsData.length === 0 ? (
            <p className="text-md text-center text-gray-400">
              No blog posts yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPostsData.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <Card className="p-6 hover:border-brand-500/60 hover:bg-content1/40 transition-colors cursor-pointer h-full flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 font-atirose text-brand-500">
                      {post.title || "Untitled"}
                    </h2>
                    {post.date && (
                      <p className="text-sm text-gray-400 mb-4">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    <div className="mt-auto">
                      <span className="text-sm text-brand-500 hover:underline">
                        Read more →
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
