import { useEffect } from "react";

import BoothCarousel from "@/components/carnival/booth/BoothCarousel";
import { setSnapPoints } from "@/store/features/cardSlice";
import { useAppDispatch } from "@/store/hooks";

const BoothCard = () => {
  const dispatch = useAppDispatch();

  // set the mid snap point
  // TODO: should change based on if has food eateries
  useEffect(() => {
    dispatch(setSnapPoints([170, 300, screen.availHeight]));
  }, [dispatch]);

  return (
    <div className="max-h-screen overflow-y-auto scroll-smooth">
      <p className="m-5 text-sm font-medium">
        Booth is one of the biggest showpieces of Spring Carnival. Student
        organizations build multi-story structures around our chosen theme, such
        as last year's theme Arcade. These booths include interactive games and
        elaborate decorations. The booths are located on Midway, at the College
        of Fine Arts parking lot. Admission is free to see booths!
      </p>
      <BoothCarousel />
    </div>
  );
};

export default BoothCard;
