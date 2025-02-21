import FormattedDate from "@/components/FormattedDate";
import { useConfig } from "@/lib/config";
import Link from "next/link";

const BlogPost = ({ post }) => {
  const BLOG = useConfig();

  return (
    <Link href={`${BLOG.path}/${post.slug}`}>
      <div className="flex flex-col md:flex-row gap-6 mb-6 md:mb-8 rounded dark:outline-zinc-700 outline-violet-300 outline outline-2 outline-offset-8 dark:hover:outline-zinc-400 hover:outline-violet-400 group/postcard p-2">
        <article key={post.id} className="flex-1">
          <header className="flex flex-col justify-between md:flex-row md:items-baseline">
            <h2 className="text-lg md:text-2xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
              {post.title}
            </h2>
            <time className="flex-shrink-0 text-gray-600 dark:text-gray-400">
              <FormattedDate date={post.date} />
            </time>
          </header>
          <main>
            <p className="hidden md:block leading-8 text-gray-700 dark:text-gray-300">
              {post.summary || post.preview}
            </p>
          </main>
        </article>

        {post.firstImage && (
          <div className="w-full md:w-32 h-32 md:h-32 flex-shrink-0 overflow-hidden flex items-center justify-center">
            <img
              src={post.firstImage}
              alt={post.title}
              className="w-full h-full object-cover rounded transition-transform duration-300 group-hover/postcard:scale-110"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default BlogPost;
