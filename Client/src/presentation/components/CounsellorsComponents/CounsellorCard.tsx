import React from 'react';

interface CardData {
    name: string;
    specialty: string;
    description: string;
    expertise: string[];
    availability: string;
    languages: string;
    themeColor: string; 
    badgeText: string;
}

interface StyleConfig {
    card_background: string;
    text_color: string;
    font_family: string;
    font_size: number;
}

interface CounselorCardProps {
    data: CardData;
    styles: StyleConfig;
}

const CustomCardStyles = () => (
    <style>
        {`
          .counselor-card {
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
          }
          .counselor-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
          }
        `}
    </style>
);


const CounselorCard: React.FC<CounselorCardProps> = ({ data, styles }) => {
    const baseSize = styles.font_size;

    const cardStyle = {
        position: 'relative' as React.CSSProperties['position'],
        overflow: 'hidden' as React.CSSProperties['overflow'],
        backgroundColor: styles.card_background,
    };

    return (
        <div className="counselor-card rounded-2xl p-8 shadow-lg" style={cardStyle}>
            <CustomCardStyles /> 
            
            <div className="mb-6">
                <div 
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" 
                    style={{ background: `linear-gradient(135deg, ${data.themeColor} 0%, #065f46 100%)` }}
                >
                    <svg className="w-12 h-12" style={{ color: '#ffffff' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
                {/* Badge - Màu động */}
                <div className="text-center mb-4">
                    <span 
                        className="badge" 
                        style={{ backgroundColor: `${data.themeColor}1A`, color: data.themeColor, padding: '0.25rem 0.75rem' }}
                    >
                        {/* Icon giả định cho chứng nhận */}
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z" /></svg> {data.badgeText}
                    </span>
                </div>
            </div>
            
            <h3 className="text-center mb-2" style={{ fontSize: `${baseSize * 1.5}px`, fontWeight: 700, color: styles.text_color, fontFamily: styles.font_family }}>
                {data.name}
            </h3>
            <p className="text-center mb-4" style={{ fontSize: `${baseSize}px`, fontWeight: 600, color: data.themeColor, fontFamily: styles.font_family }}>
                {data.specialty}
            </p>
            <p className="mb-6" style={{ fontSize: `${baseSize * 0.95}px`, color: '#64748b', lineHeight: 1.7, fontFamily: styles.font_family }}>
                {data.description}
            </p>
            
            <div className="mb-6">
                <h4 className="mb-3" style={{ fontSize: '0.875rem', fontWeight: 600, color: styles.text_color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lĩnh vực chuyên môn</h4>
                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-2" style={{ gap: '0.5rem' }}>
                    {data.expertise.map((item, index) => (
                        <span key={index} className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>
            
            {/* Availability & Languages */}
            <div className="border-t pt-4 mb-6" style={{ borderColor: '#e2e8f0' }}>
                <div className="flex justify-between mb-2" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="text-gray-500" style={{ fontSize: '0.875rem' }}>📅 Thời gian</span>
                    <span className="font-semibold" style={{ fontSize: '0.875rem', color: styles.text_color }}>{data.availability}</span>
                </div>
                <div className="flex justify-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-gray-500" style={{ fontSize: '0.875rem' }}>💬 Ngôn ngữ</span>
                    <span className="font-semibold" style={{ fontSize: '0.875rem', color: styles.text_color }}>{data.languages}</span>
                </div>
            </div>
            
      
        </div>
    );
};

export default CounselorCard;