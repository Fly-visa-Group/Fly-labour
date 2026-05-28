import { useState } from "react";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import {
  Globe,
  Award,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Play,
  X,
} from "lucide-react";
import { useT } from "@core/hooks/useT";
import CountryFlag from "@components/widgets/CountryFlag";
import { useLangStore } from "@core/store/langStore";
import s from "./AboutSection.module.scss";

export default function AboutSection() {
  const { t } = useT();
  const d = t("about");
  const { lang } = useLangStore();

  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const videos = [
    {
      src: "/fly-visa.mp4",
      title: lang === "vi" ? "Giới thiệu Fly Visa & Dịch vụ Định cư" : "Introduction to Fly Visa & Settlement Services",
      desc: lang === "vi" ? "Tổng quan về dịch vụ tư vấn định cư, việc làm và visa của Fly Visa." : "Overview of Fly Visa's settlement, employment, and visa consulting services."
    },
    {
      src: "/fly-visa-2.mp4",
      title: lang === "vi" ? "Khách hàng nhận kết quả Visa thành công" : "Customers Receiving Successful Visa Results",
      desc: lang === "vi" ? "Niềm vui và chia sẻ thực tế từ các khách hàng đã nhận visa thành công." : "Real joy and feedback from our customers who successfully received visas."
    }
  ];

  return (
    <div id="about" className={s.section}>
      {/* Video Section */}
      <div className={s.mediaSection}>
        <div className="fl-max-6xl">
          <div className={s.centerHead}>
            <p className={s.sectionBadge}>{d.v_badge}</p>
            <h2 className={s.sectionTitle}>{d.v_title}</h2>
            <p className={s.sectionSubtitle}>{d.v_desc}</p>
          </div>

          <div className={s.videoGrid}>
            {videos.map((vid, idx) => (
              <div key={idx} className={s.videoCard}>
                <div
                  className={s.videoThumbnail}
                  onClick={() => setActiveVideo(vid.src)}
                >
                  <video
                    src={`${vid.src}#t=0.1`}
                    className={s.videoImage}
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className={s.playButton}>
                    <Play size={20} fill="white" />
                  </div>
                </div>
                <div className={s.videoInfo}>
                  <h3 className={s.videoTitle}>{vid.title}</h3>
                  <p className={s.videoDesc}>{vid.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Award Section */}
      <div className={s.awardSection}>
        <div className="fl-max-6xl">
          <div className={s.awardHeader}>
            <div className={s.awardBadge}>
              <Award size={24} />
              <span>TOP 10</span>
            </div>
            <h2 className={s.awardTitle}>{d.award_title}</h2>
            <p className={s.awardDesc}>{d.award_desc}</p>
          </div>
          <Marquee direction="left" speed={50} pauseOnHover={true}>
            <div className={s.awardImages}>
              <img src="/gallery/event-2.jpg" alt="Award 1" className={s.awardImg} onClick={() => setLightboxImage("/gallery/event-2.jpg")} />
              <img src="/gallery/event-3.jpg" alt="Award 2" className={s.awardImg} onClick={() => setLightboxImage("/gallery/event-3.jpg")} />
              <img src="/chung-nhan-1.jpg" alt="Award 3" className={s.awardImg} onClick={() => setLightboxImage("/chung-nhan-1.jpg")} />
              <img src="/chung-nhan-2.jpg" alt="Award 4" className={s.awardImg} onClick={() => setLightboxImage("/chung-nhan-2.jpg")} />
              <img src="/chung-nhan-3.jpg" alt="Award 5" className={s.awardImg} onClick={() => setLightboxImage("/chung-nhan-3.jpg")} />
            </div>
          </Marquee>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className={s.videoModal} onClick={() => setActiveVideo(null)}>
          <div
            className={s.videoModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={s.closeButton}
              onClick={() => setActiveVideo(null)}
            >
              <X size={24} />
            </button>
            <video
              src={activeVideo}
              className={s.videoFrame}
              controls
              autoPlay
            />
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className={s.lightbox} onClick={() => setLightboxImage(null)}>
          <button
            className={s.closeButton}
            onClick={() => setLightboxImage(null)}
          >
            <X size={24} />
          </button>
          <img src={lightboxImage} alt="Gallery" className={s.lightboxImage} />
        </div>
      )}

      {/* Markets Section */}
      <div className={s.marketsSection}>
        <div className={`${s.twoCol} fl-max-6xl`}>
          <div>
            <p className={s.sectionBadge}>{d.m_badge}</p>
            <h2 className={s.sectionTitle}>{d.m_title}</h2>
            <p className={`${s.paragraph} ${s.paragraphSpacing}`}>{d.m_desc1}</p>
            <p className={s.paragraph}>{d.m_desc2}</p>
          </div>
          <div className={s.countriesGrid}>
            {[
              { label: d.c_aus, flagCode: "australia", jobs: `1,200+ ${d.jobs}` },
              { label: d.c_can, flagCode: "canada", jobs: `800+ ${d.jobs}` },
              { label: d.c_nz, flagCode: "new_zealand", jobs: `600+ ${d.jobs}` },
              {
                label: d.c_other,
                flagCode: "other",
                jobs: Object.values(d).includes("Và nhiều hơn") ? "12+ quốc gia khác" : d.other_countries,
              },
            ].map((country) => (
              <div key={country.label} className={s.countryCard}>
                <div className="flex justify-center mb-2">
                  {country.flagCode === "other" ? (
                    <Globe size={32} className="text-amber-500" />
                  ) : (
                    <CountryFlag country={country.flagCode} style={{ width: "2.5rem", height: "auto" }} />
                  )}
                </div>
                <p className={s.countryLabel}>{country.label}</p>
                <p className={s.countryJobs}>{country.jobs}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className={s.contactSection}>
        <div className={`${s.contactHead} fl-max-4xl`}>
          <h2 className={s.contactTitle}>{d.ct_title}</h2>
          <p className={s.contactDesc}>{d.ct_desc}</p>
          <div className={s.contactGrid}>
            {[
              { icon: Phone, label: d.ct_hotline, value: "0866-879-755" },
              { icon: Mail, label: d.ct_email, value: "visa.service@flyimmigration.vn" },
              { icon: MapPin, label: d.ct_addr, value: "219A Nơ Trang Long, Phường Bình Thạnh, TP.HCM" },
            ].map((contact) => (
              <div key={contact.label} className={s.contactCard}>
                <contact.icon size={20} className={s.contactIcon} />
                <p className={s.contactLabel}>{contact.label}</p>
                <p className={s.contactValue}>{contact.value}</p>
              </div>
            ))}
          </div>
          <Link to="/contact" className={`btn-primary ${s.contactCta}`}>
            {d.ct_btn} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
