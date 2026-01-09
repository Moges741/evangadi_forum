import classes from "./Footer.module.css";
import logo from "../../assets/10002.png";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.footer_container}>
        <div className={classes.footer_section}>
          <img src={logo} alt="Evangadi Logo" className={classes.footer_logo} />
          <div className={classes.social_icons_container}>
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className={classes.footer_section}>
          <h4 className={classes.section_title}>Useful Links</h4>
          <ul className={classes.list_reset}>
            <li className={classes.list_item}>
              <a href="#" className={classes.link}>
                How it Works
              </a>
            </li>
            <li className={classes.list_item}>
              <a href="#" className={classes.link}>
                Terms of Service
              </a>
            </li>
            <li className={classes.list_item}>
              <a href="#" className={classes.link}>
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div className={classes.footer_section}>
          <h4 className={classes.section_title}>Contact Info</h4>
          <ul className={classes.list_reset}>
            <li className={classes.list_item}>
              <a href="#" className={classes.link}>
                Evangadi Networks
              </a>
            </li>
            <li className={classes.list_item}>
              <a href="mailto:support@evangadi.com" className={classes.link}>
                support@evangadi.com
              </a>
            </li>
            <li className={classes.list_item}>
              <a href="tel:+12023862702" className={classes.link}>
                +1-202-386-2702
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
