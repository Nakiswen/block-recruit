import React from 'react';
import { Card } from 'ui';
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react';

// 联系信息类型定义
interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
}

interface ContactCardProps {
  contactInfo: ContactInfo;
}

const ContactCard: React.FC<ContactCardProps> = ({ contactInfo }) => {
  const { email, phone, location, website, github, linkedin } = contactInfo;

  return (
    <Card title="联系信息" className="h-full">
      <div className="grid gap-4">
        {email && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">邮箱</p>
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                {email}
              </a>
            </div>
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <Phone className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">电话</p>
              <a href={`tel:${phone}`} className="text-green-600 hover:underline">
                {phone}
              </a>
            </div>
          </div>
        )}

        {location && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <MapPin className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">地址</p>
              <p className="text-gray-600">{location}</p>
            </div>
          </div>
        )}

        {website && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <Globe className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">网站</p>
              <a href={website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                {website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          </div>
        )}

        {github && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <Github className="w-5 h-5 text-gray-800" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">GitHub</p>
              <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
                {github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
              </a>
            </div>
          </div>
        )}

        {linkedin && (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <Linkedin className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">LinkedIn</p>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                {linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
              </a>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContactCard; 