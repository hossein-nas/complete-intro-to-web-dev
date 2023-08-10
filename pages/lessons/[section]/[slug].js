import { useContext, useEffect } from "react";
import Head from "next/head";
import { getLesson, getLessons } from "../../../data/lesson";
import getCourseConfig from "../../../data/course";
import Corner from "../../../components/corner";
import SupportTweet from "../../../components/support-tweet";
import { Context } from "../../../context/headerContext";

import * as popmotion from "popmotion";
import Link from "next/link";
import { useRouter } from "next/router";

globalThis.popmotion = popmotion;

export default function LessonSlug({ post }) {
  const router = useRouter();
  const courseInfo = getCourseConfig();
  const [_, setHeader] = useContext(Context);
  useEffect(() => {
    window.klipse.plugin.init(klipse.run.plugin_prod.plugin.settings());
    setHeader({
      section: post.section,
      title: post.title,
      icon: post.icon,
    });
    return () => setHeader({});
  }, [router.asPath]);

  const title = post.title
    ? `${post.title} – ${courseInfo.title}`
    : courseInfo.title;
  const description = post.description
    ? post.description
    : courseInfo.description;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta name="keywords" content={courseInfo.keywords.join(",")}></meta>
        <meta name="og:description" content={description}></meta>
        <meta name="og:title" content={title}></meta>
        <meta
          name="og:image"
          content={`${process.env.BASE_URL}/images/social-share-cover.jpg`}
        ></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>
      <div className="lesson-container">
        <div className="lesson">
          <div
            className="lesson-content"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <div className="lesson-links">
            {post.prevSlug ? (
              <Link href={post.prevSlug}>
                <a className="prev">← Previous</a>
              </Link>
            ) : null}
            {post.nextSlug ? (
              <Link href={post.nextSlug}>
                <a className="next">Next →</a>
              </Link>
            ) : null}
          </div>
        </div>
        <Corner />
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const post = await getLesson(params.section, params.slug);
  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const sections = await getLessons();
  const lessons = sections.map((section) => section.lessons);
  const slugs = lessons.flat().map((lesson) => lesson.fullSlug);

  return { paths: slugs, fallback: false };
}
