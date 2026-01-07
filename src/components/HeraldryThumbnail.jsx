import React from 'react';

/**
 * HeraldryThumbnail Component
 * 
 * Displays house heraldry as a thumbnail image or placeholder
 * Used in sidebars, dropdowns, and anywhere house icons are needed
 * 
 * Props:
 * - house: House object with heraldry data
 * - size: 'small' (40px) | 'medium' (80px) | 'large' (200px)
 * - onClick: Optional click handler (for opening heraldry creator)
 * - showBorder: Whether to show house color border
 * - isDarkTheme: Theme for placeholder styling
 */
function HeraldryThumbnail({ 
  house, 
  size = 'small', 
  onClick = null, 
  showBorder = true,
  isDarkTheme = true 
}) {
  
  const sizeMap = {
    small: 40,
    medium: 80,
    large: 200
  };
  
  const pixelSize = sizeMap[size] || 40;
  
  const theme = isDarkTheme ? {
    bg: '#2d2418',
    text: '#e9dcc9',
    border: '#4a3d2a',
    placeholder: '#3a2f20'
  } : {
    bg: '#ede7dc',
    text: '#2d2418',
    border: '#d4c4a4',
    placeholder: '#f5ede0'
  };
  
  // Check if house has heraldry
  const hasHeraldry = house?.heraldryThumbnail || house?.heraldryImageData;
  
  // Use thumbnail if available, otherwise fall back to display image
  const imageSource = house?.heraldryThumbnail || house?.heraldryImageData;
  
  const containerStyle = {
    width: `${pixelSize}px`,
    height: `${pixelSize}px`,
    display: 'inline-block',
    cursor: onClick ? 'pointer' : 'default',
    border: showBorder ? `2px solid ${house?.colorCode || theme.border}` : 'none',
    borderRadius: '4px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    backgroundColor: theme.placeholder
  };
  
  const hoverStyle = onClick ? {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  } : {};
  
  if (hasHeraldry) {
    // Display actual heraldry image
    return (
      <div 
        style={containerStyle}
        onClick={onClick}
        onMouseEnter={(e) => onClick && Object.assign(e.currentTarget.style, hoverStyle)}
        onMouseLeave={(e) => onClick && Object.assign(e.currentTarget.style, {
          transform: 'scale(1)',
          boxShadow: 'none'
        })}
        title={house?.houseName ? `${house.houseName} Heraldry` : 'House Heraldry'}
      >
        <img 
          src={imageSource} 
          alt={`${house?.houseName || 'House'} Heraldry`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </div>
    );
  }
  
  // Display placeholder (+ icon to add heraldry)
  const handleClick = (e) => {
    console.log('🛡️ Heraldry thumbnail clicked!');
    console.log('onClick function:', onClick);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div 
      style={containerStyle}
      onClick={handleClick}
      onMouseEnter={(e) => onClick && Object.assign(e.currentTarget.style, hoverStyle)}
      onMouseLeave={(e) => onClick && Object.assign(e.currentTarget.style, {
        transform: 'scale(1)',
        boxShadow: 'none'
      })}
      title={onClick ? 'Click to add heraldry' : 'No heraldry set'}
    >
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: house?.colorCode ? `${house.colorCode}22` : theme.placeholder,
        color: house?.colorCode || theme.text,
        fontSize: `${pixelSize * 0.6}px`,
        fontWeight: 'bold',
        fontFamily: 'serif'
      }}>
        {onClick ? '+' : house?.houseName?.charAt(0).toUpperCase() || '?'}
      </div>
    </div>
  );
}

export default HeraldryThumbnail;
