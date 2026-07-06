import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h2>mkatoliki</h2>
          <p>
            Your trusted Catholic shop for prayer books, rosaries,
            sacramentals, gifts and church supplies.
          </p>
        </div>

        <div>
          <h3>Shop</h3>
          <ul>
            <li>Books</li>
            <li>Rosaries</li>
            <li>Crosses</li>
            <li>Prayer Items</li>
            <li>Candles</li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>

          <p>
            <Phone size={16} /> +254 105 380 740
          </p>

          <p>
            <Mail size={16} /> info@mkatoliki.co.ke
          </p>

          <p>
            <MapPin size={16} /> Nairobi, Kenya
          </p>
        </div>

        <div>
          <h3>Follow Us</h3>

          <div className="footer-socials">
            <a
              href="https://wa.me/254105380740"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={20} />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              <Facebook size={20} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} mkatoliki. All rights reserved.
      </div>
    </footer>
  );
}