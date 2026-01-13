import React from "react";
import {
  Info,
  UserPlus,
  Layers,
  Search,
  MessageSquarePlus,
  MessageCircle,
  ShieldCheck,
  Bot,
  HelpCircle,
  Check,
} from "lucide-react";
import classes from "./HowItWorks.module.css";

const HowItWorks = () => {
  return (
    <section className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.heading}>How It Works</h1>

        {/* INTRO */}
        <section className={classes.section}>
          <div className={classes.headerRow}>
            <span className={classes.iconWrapper}>
              <Info className={classes.icon} />
            </span>
            <h2 className={classes.subHeading}>Introduction</h2>
          </div>
          <p>
            Welcome to <strong>EVANGADI FORUM</strong>, a platform where
            technology enthusiasts connect, share ideas, and solve problems
            together. Our forum is designed to help users find answers,
            contribute knowledge, and participate in meaningful discussions
            within a growing community.
          </p>
        </section>

        {/* ACCOUNT */}
        <section className={classes.section}>
          <div className={classes.headerRow}>
            <span className={classes.iconWrapper}>
              <UserPlus className={classes.icon} />
            </span>
            <h2 className={classes.subHeading}>Creating an Account</h2>
          </div>
          <p>
            To join the Evangadi community, click the “Sign Up” button located
            at the top right of the page. Enter your email address, choose a
            username, and create a password. and then hit the "agree and join" button. 
          </p>
        </section>

        {/* CATEGORIES */}
        <section className={classes.section}>
          <div className={classes.headerRow}>
            <span className={classes.iconWrapper}>
              <Layers className={classes.icon} />
            </span>
            <h2 className={classes.subHeading}>Exploring Categories</h2>
          </div>

          <p>
            Our forum is organized into different categories to make browsing
            easier:
          </p>

          <ul className={classes.list}>
            <li>
              <span className={classes.iconWrapper}>
                <Check className={classes.icon} />
              </span>
              Categories displaying questions asked by other forum members
            </li>
            <li>
              <span className={classes.iconWrapper}>
                <Check className={classes.icon} />
              </span>
              Pages showing detailed views of individual questions and answers
            </li>
            <li>
              <span className={classes.iconWrapper}>
                <Check className={classes.icon} />
              </span>
              Areas where you can post your own questions
            </li>
          </ul>

          <p>
            Use the navigation bar to move between pages, return to the home
            page, or log out of your account.
          </p>
        </section>

        {/* SEARCH */}
        <section className={classes.section}>
          <div className={classes.headerRow}>
            <span className={classes.iconWrapper}>
              <Search className={classes.icon} />
            </span>
            <h2 className={classes.subHeading}>Searching for Questions</h2>
          </div>
          <p>
            If you are looking for specific topics, use the search bar at the
            top of the home page. Enter relevant keywords to quickly find
            discussions, threads, and answers shared by the community.
          </p>
        </section>

        {/* POST */}
        <section className={classes.section}>
          <div className={classes.headerRow}>
            <span className={classes.iconWrapper}>
              <MessageSquarePlus className={classes.icon} />
            </span>
            <h2 className={classes.subHeading}>Posting a New Question</h2>
          </div>
          <p>
            Logged-in users can post new questions by providing a clear title
            and a detailed explanation. Once posted, the question becomes
            visible to the community. Users can edit or delete only the
            questions they have personally posted.
          </p>
        </section>

        {/* REPLY */}
        <section className={classes.section}>
          <div className={classes.headerRow}>
            <span className={classes.iconWrapper}>
              <MessageCircle className={classes.icon} />
            </span>
            <h2 className={classes.subHeading}>Replying to a Question</h2>
          </div>
          <p>
            To respond to a question, open the question thread and type your
            answer in the provided text box. Users can edit or delete only their
            own answers.
          </p>
        </section>

        {/* GUIDELINES */}
        <section className={classes.section}>
          <div className={classes.headerRow}>
            <span className={classes.iconWrapper}>
              <ShieldCheck className={classes.icon} />
            </span>
            <h2 className={classes.subHeading}>Community Guidelines</h2>
          </div>
          <p>
            To maintain a positive experience for everyone, users are expected
            to follow community guidelines. Be respectful, avoid spam, and
            contribute thoughtfully.
          </p>
        </section>

        {/* BOT */}
        <section className={classes.section}>
          <div className={classes.headerRow}>
            <span className={classes.iconWrapper}>
              <Bot className={classes.icon} />
            </span>
            <h2 className={classes.subHeading}>AI Chatbot Assistance</h2>
          </div>
          <p>
            All logged-in users have access to an AI chatbot that can answer
            questions and provide assistance. The chatbot remembers previous
            conversations, allowing it to give more accurate and personalized
            responses.
          </p>
        </section>

        {/* SUPPORT */}
        <section className={classes.section}>
          <div className={classes.headerRow}>
            <span className={classes.iconWrapper}>
              <HelpCircle className={classes.icon} />
            </span>
            <h2 className={classes.subHeading}>Contact and Support</h2>
          </div>
          <p>
            For more information, visit the Evangadi Networks page or contact
            our support team through the Contact Info section at the bottom of
            the page.
          </p>
        </section>

        <p className={classes.closingMessage}>
          We’re excited to have you as part of the Evangadi community! Ask
          questions, share knowledge, explore discussions, and enjoy learning
          together.
          <h3>Happy posting !</h3>
        </p>
      </div>
    </section>
  );
};

export default HowItWorks;
