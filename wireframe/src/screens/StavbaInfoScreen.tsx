import { useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";

function StavbaInfoScreen() {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate(-1)}>←</Button>
    </div>
  );
}

export default StavbaInfoScreen;
