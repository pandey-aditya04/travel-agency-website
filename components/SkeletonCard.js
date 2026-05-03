'use client';

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img"></div>
      <div className="skeleton-content">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line long"></div>
        <div className="skeleton-line medium"></div>
        <div className="skeleton-footer">
          <div className="skeleton-line price"></div>
          <div className="skeleton-line button"></div>
        </div>
      </div>

      <style jsx>{`
        .skeleton-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .skeleton-img {
          width: 100%;
          height: 250px;
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        .skeleton-content {
          padding: 25px;
        }
        .skeleton-line {
          height: 12px;
          background: #f0f0f0;
          margin-bottom: 15px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        .skeleton-line.short { width: 30%; }
        .skeleton-line.long { width: 90%; height: 20px; }
        .skeleton-line.medium { width: 60%; }
        
        .skeleton-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 25px;
          padding-top: 15px;
          border-top: 1px solid #f9f9f9;
        }
        .skeleton-line.price { width: 40%; height: 25px; margin-bottom: 0; }
        .skeleton-line.button { width: 30%; height: 25px; margin-bottom: 0; }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default SkeletonCard;
