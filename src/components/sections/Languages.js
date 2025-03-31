import React from 'react';

const Languages = ({ data, color }) => {
  const languages = data.languages;
  const loop = [1, 2, 3, 4, 5];

  return (
    <div className='languages'>
      <p className='heading' style={{ color: `${color.primary}` }}>
        <span className='material-icons' style={{ color: `${color.primary}` }}>
          
        </span>
        LANGUAGES
      </p>
      <hr style={{ borderColor: `${color.primary}` }} />
      <div className='languages-container'>
        {languages.map((item, index) => {
          return (
            <div key={index} className='item'>
              <div className='language'>{item.language}</div>
              <div className='level'>
                {loop.map((num, i) => {
                  if (num <= item.level) {
                    return (
                      <div
                        key={i}
                        className='material-icons star'
                        style={{ color: `${color.primary}` }}
                      >
                        
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={i}
                        className='material-icons star'
                        style={{ color: `${color.primary}` }}
                      >
                        
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Languages;
