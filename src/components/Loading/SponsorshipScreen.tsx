import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ENFOR from "../../assets/icons/enfor.svg?react";
export const SponsorshipScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/spaces", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-400 h-400 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
        <ENFOR />
      </div>
    </div>
  );
};
