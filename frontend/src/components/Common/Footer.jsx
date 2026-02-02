import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Heart, Globe, Facebook, Twitter, Instagram, Linkedin,
  Youtube, Mail, Phone, MapPin, Shield, Lock, Award,
  Users, BookOpen, GraduationCap, ChevronUp, ExternalLink,
  Download, FileText, MessageSquare, HelpCircle, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t('footer.home'), path: '/' },
    { label: t('footer.about'), path: '/about' },
    { label: t('footer.courses'), path: '/courses' },
    { label: t('footer.teachers'), path: '/teachers' },
    { label: t('footer.events'), path: '/events' },
    { label: t('footer.contact'), path: '/contact' }
  ];

  const academicLinks = [
    { label: t('footer.academicCalendar'), path: '/academic-calendar' },
    { label: t('footer.courseCatalog'), path: '/courses' },
    { label: t('footer.library'), path: '/library' },
    { label: t('footer.research'), path: '/research' },
    { label: t('footer.scholarships'), path: '/scholarships' },
    { label: t('footer.admissions'), path: '/admissions' }
  ];

  const studentResources = [
    { label: t('footer.studentPortal'), path: '/dashboard' },
    { label: t('footer.assignments'), path: '/assignments' },
    { label: t('footer.grades'), path: '/grades' },
    { label: t('footer.timetable'), path: '/timetable' },
    { label: t('footer.eLibrary'), path: '/library' },
    { label: t('footer.careerServices'), path: '/career' }
  ];

  const socialMedia = [
    { icon: Facebook, label: 'Facebook', url: 'https://facebook.com/falconacademy' },
    { icon: Twitter, label: 'Twitter', url: 'https://twitter.com/falconacademy' },
    { icon: Instagram, label: 'Instagram', url: 'https://instagram.com/falconacademy' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://linkedin.com/school/falconacademy' },
    { icon: Youtube, label: 'YouTube', url: 'https://youtube.com/falconacademy' }
  ];

  const contactInfo = [
    { icon: Phone, label: '+251 11 123 4567' },
    { icon: Mail, label: 'info@falconacademy.edu.et' },
    { icon: MapPin, label: 'Addis Ababa, Ethiopia' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Falcon Academy</h2>
                <p className="text-sm text-gray-400">Digital Learning Management System</p>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm">
              {t('footer.description')}
            </p>
            
            <div className="flex items-center gap-4">
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* App Download */}
            <div className="pt-4">
              <p className="text-sm font-medium mb-2">{t('footer.downloadApp')}</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 384 512">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  <span className="text-sm">App Store</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 512 512">
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
                  </svg>
                  <span className="text-sm">Play Store</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ChevronUp className="w-5 h-5 text-blue-400" />
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-400" />
              {t('footer.academicResources')}
            </h3>
            <ul className="space-y-2">
              {academicLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Student Resources */}
            <h3 className="text-lg font-semibold mb-4 mt-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              {t('footer.studentResources')}
            </h3>
            <ul className="space-y-2">
              {studentResources.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <GraduationCap className="w-3 h-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-yellow-400" />
              {t('footer.contactUs')}
            </h3>
            
            <div className="space-y-3 mb-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-300">
                  <info.icon className="w-4 h-4" />
                  <span>{info.label}</span>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <h4 className="font-semibold mb-2">{t('footer.newsletter')}</h4>
              <p className="text-sm text-gray-400 mb-3">
                {t('footer.newsletterDescription')}
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg font-medium transition-all"
                >
                  {t('footer.subscribe')}
                </button>
              </form>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-xs">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-xs">ISO Certified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">2,500+</div>
              <div className="text-sm text-gray-400">{t('footer.activeStudents')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">150+</div>
              <div className="text-sm text-gray-400">{t('footer.certifiedTeachers')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">95%</div>
              <div className="text-sm text-gray-400">{t('footer.satisfactionRate')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">8</div>
              <div className="text-sm text-gray-400">{t('footer.yearsExperience')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Falcon Academy. {t('footer.allRightsReserved')}.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="text-sm text-gray-400 hover:text-white">
                  {t('footer.privacyPolicy')}
                </Link>
                <Link to="/terms" className="text-sm text-gray-400 hover:text-white">
                  {t('footer.termsOfService')}
                </Link>
                <Link to="/cookies" className="text-sm text-gray-400 hover:text-white">
                  {t('footer.cookiePolicy')}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {t('footer.language')}: English
                </span>
              </div>
              
              <button
                onClick={scrollToTop}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label={t('footer.backToTop')}
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Made with love */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
              {t('footer.madeWith')}
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              {t('footer.inEthiopia')}
            </p>
          </div>

          {/* Support */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">{t('footer.helpCenter')}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{t('footer.liveChat')}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{t('footer.callSupport')}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;