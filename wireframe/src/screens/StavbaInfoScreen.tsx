import { useNavigate } from "react-router-dom";

function StavbaInfoScreen() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        ←
      </button>
    </div>
  );
}

export default StavbaInfoScreen;
