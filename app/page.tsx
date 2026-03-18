"use client";

import styles from "./page.module.css";

import Login from "../components/home-components/AuthModal";
import Feature from "../components/home-components/Feature";
import StatisticsHeading from "../components/home-components/StatisticsHeading";
import StatisticsData from "../components/home-components/StatisticsData";
import Review from "../components/home-components/Review";
import Numbers from "../components/home-components/Numbers";
import FooterBlock from "../components/home-components/FooterBlock";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../lib/redux/store";
import { useAuthModal } from '@/context/AuthModalContext';

import { AiFillFileText, AiFillBulb, AiFillAudio } from "react-icons/ai";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import { RiLeafLine } from "react-icons/ri";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const {showModal, setShowModal} = useAuthModal();

  useEffect(() => {
    if (user) {
      router.push("/for-you");
    }
  }, [user]);

  useEffect(() => {
    setIsMounted(true);
    const interval: NodeJS.Timeout = setInterval(() => {
      setActiveIndex((prevIndex: number) => (prevIndex + 1) % 6);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {showModal && <Login />}

      <nav className={styles["nav"]}>
        <div className={styles["nav__wrapper"]}>
          <figure className={`${styles["nav__img--mask"]}`}>
            <img className={styles.nav__img} src="logo.png" alt="logo" />
          </figure>
          <ul className={styles["nav__list--wrapper"]}>
            <li
              className={`${styles["nav__list"]} ${styles["nav__list--login"]}`}
              onClick={() => setShowModal(true)}
            >
              Login
            </li>

            <li
              className={`${styles["nav__list"]} ${styles["nav__list--mobile"]}`}
            >
              About
            </li>
            <li
              className={`${styles["nav__list"]} ${styles["nav__list--mobile"]}`}
            >
              Contact
            </li>
            <li
              className={`${styles["nav__list"]} ${styles["nav__list--mobile"]}`}
            >
              Help
            </li>
          </ul>
        </div>
      </nav>

      <section id="landing">
        <div className={styles["container"]}>
          <div className={styles["row"]}>
            <div className={styles["landing__wrapper"]}>
              <div className={styles["landing__content"]}>
                <div className={styles["landing__content__title"]}>
                  Gain more knowledge{" "}
                  <br className={styles["remove--tablet"]} />
                  in less time
                </div>

                <div className={styles["landing__content__subtitle"]}>
                  Great summaries for busy people,
                  <br className={styles["remove--tablet"]} />
                  individuals who barely have time to read,
                  <br className={styles["remove--tablet"]} />
                  and even people who don’t like to read.
                </div>

                <button
                  type="button"
                  className={`${styles["btn"]} ${styles["home__cta--btn"]}`}
                  onClick={() => setShowModal(true)}
                >
                  Login
                </button>
              </div>
              <figure className={styles["landing__image--mask"]}>
                <img src="landing.png" alt="landing" />
              </figure>
            </div>
          </div>
        </div>
      </section>
      <section id="features">
        <div className={styles["container"]}>
          <div className={styles["row"]}>
            <div className={styles["section__title"]}>
              Understand books in few minutes
            </div>
            <div className={styles["features__wrapper"]}>
              <Feature
                icon={<AiFillFileText />}
                title="Read or listen "
                subtitle="Save time by getting the core ideas from the best books."
              />

              <Feature
                icon={<AiFillBulb />}
                title="Find your next read"
                subtitle="Explore book lists and personalized recommendations."
              />

              <Feature
                icon={<AiFillAudio />}
                title="Briefcasts"
                subtitle="Gain valuable insights from briefcasts"
              />
            </div>
            <div className={styles["statistics__wrapper"]}>
              <div className={styles["statistics__content--header"]}>
                <StatisticsHeading
                  index={0}
                  activeIndex={activeIndex}
                  heading="Enhance your knowledge"
                />
                <StatisticsHeading
                  index={1}
                  activeIndex={activeIndex}
                  heading="Achieve greater success"
                />
                <StatisticsHeading
                  index={2}
                  activeIndex={activeIndex}
                  heading="Improve your health"
                />
                <StatisticsHeading
                  index={3}
                  activeIndex={activeIndex}
                  heading="Develop better parenting skills"
                />
                <StatisticsHeading
                  index={4}
                  activeIndex={activeIndex}
                  heading="Increase happiness"
                />
                <StatisticsHeading
                  index={5}
                  activeIndex={activeIndex}
                  heading="Be the best version of yourself!"
                />
              </div>
              <div className={styles["statistics__content--details"]}>
                <StatisticsData
                  percent={93}
                  startDescription="of Summarist members "
                  boldDescription="significantly increase"
                  endDescription=" reading frequency."
                />

                <StatisticsData
                  percent={96}
                  startDescription="of Summarist members "
                  boldDescription="establish better"
                  endDescription=" habits."
                />

                <StatisticsData
                  percent={90}
                  startDescription="have made "
                  boldDescription="significant positive"
                  endDescription=" change to their lives."
                />
              </div>
            </div>
            <div className={styles["statistics__wrapper"]}>
              <div
                className={`
                  ${styles["statistics__content--details"]} 
                  ${styles["statistics__content--details-second"]}`}
              >
                <StatisticsData
                  percent={91}
                  startDescription="of Summarist members "
                  boldDescription="report feeling more productive"
                  endDescription=" after incorporating the service into their daily routine."
                />

                <StatisticsData
                  percent={94}
                  startDescription="of Summarist members have "
                  boldDescription="noticed an improvement"
                  endDescription=" in their overall comprehension and retention of information."
                />

                <StatisticsData
                  percent={88}
                  startDescription="of Summarist members "
                  boldDescription="feel more informed"
                  endDescription=" about current events and industry trends since using the platform."
                />
              </div>
              <div
                className={`
                ${styles["statistics__content--header"]} 
                ${styles["statistics__content--header-second"]}`}
              >
                <StatisticsHeading
                  index={0}
                  activeIndex={activeIndex}
                  heading="Expand your learning"
                />
                <StatisticsHeading
                  index={1}
                  activeIndex={activeIndex}
                  heading="Accomplish your goals"
                />
                <StatisticsHeading
                  index={2}
                  activeIndex={activeIndex}
                  heading="Strengthen your vitality"
                />
                <StatisticsHeading
                  index={3}
                  activeIndex={activeIndex}
                  heading="Become a better caregiver"
                />
                <StatisticsHeading
                  index={4}
                  activeIndex={activeIndex}
                  heading="Improve your mood"
                />
                <StatisticsHeading
                  index={5}
                  activeIndex={activeIndex}
                  heading="Maximize your abilities"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="reviews">
        <div className={styles["row"]}>
          <div className={styles["container"]}>
            <div className={styles["section__title"]}>What our members say</div>
            <div className={styles["reviews__wrapper"]}>
              <Review
                name="Hanna M."
                rating={5}
                startParagraph="This app has been a "
                boldParagraph="game-changer"
                endParagraph=" for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers."
              />

              <Review
                name="David B."
                rating={5}
                startParagraph="I love this app! It provides "
                boldParagraph="concise and accurate summaries"
                endParagraph=" of books in a way that is easy to understand. It's also very user-friendly and intuitive."
              />

              <Review
                name="Nathan S."
                rating={5}
                startParagraph=" This app is a great way to get the main takeaways from a book
                  without having to read the entire thing. "
                boldParagraph="The summaries are well-written and informative."
                endParagraph=" Definitely worth downloading."
              />

              <Review
                name="Ryan R."
                rating={5}
                startParagraph="If you're a busy person who "
                boldParagraph="loves reading but doesn't have the time"
                endParagraph=" to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book's content."
              />
            </div>

            <div className={styles["reviews__btn--wrapper"]}>
              <button
                type="button"
                className={`${styles["btn"]} ${styles["home__cta--btn"]}`}
                onClick={() => setShowModal(true)}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </section>
      <section id="numbers">
        <div className={styles["container"]}>
          <div className={styles["row"]}>
            <div className={styles["section__title"]}>
              Start growing with Summarist now
            </div>
            <div className={styles["numbers__wrapper"]}>
              <Numbers
                icon={<BiCrown />}
                numberOfIcons={1}
                title="3 Million"
                subtitle="Downloads on all platforms"
              />

              <Numbers
                icon={<BsStarFill />}
                icon2={<BsStarHalf />}
                numberOfIcons={4}
                iconClassName={styles["numbers__star--icon"]}
                title="4.5 Stars"
                subtitle="Average ratings on iOS and Google Play"
              />

              <Numbers
                icon={<RiLeafLine />}
                numberOfIcons={1}
                title="97%"
                subtitle="Of Summarist members create a better reading habit"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="footer">
        <div className={styles["container"]}>
          <div className={styles["row"]}>
            <div className={styles["footer__top--wrapper"]}>
              <FooterBlock
                title="Actions"
                link1="Summarist Magazine"
                link2="Cancel Subscription"
                link3="Help"
                link4="Contact us"
              />

              <FooterBlock
                title="Useful Links"
                link1="Pricing"
                link2="Summarist Business"
                link3="Gift Cards"
                link4="Authors & Publishers"
              />

              <FooterBlock
                title="Company"
                link1="About"
                link2="Careers"
                link3="Partners"
                link4="Code of Conduct"
              />

              <FooterBlock
                title="Other"
                link1="Sitemap"
                link2="Legal Notice"
                link3="Terms of Service"
                link4="Privacy Policies"
              />
            </div>
            <div className={styles["footer__copyright--wrapper"]}>
              <div className={styles["footer__copyright"]}>
                Copyright &copy; 2025 Summarist.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
