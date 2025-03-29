import { GeoRoom, getRoomTypeDetails } from "@cmumaps/common";
import pinIcon from "@icons/search_results/pin.svg";

import { Document } from "@/types/searchTypes";
import { getIcon } from "@/utils/iconUtils";

interface Props {
  room: (GeoRoom & { name: string }) | Document;
}

/**
 * The marker displayed for identifying the type of a room.
 * Visible on the map and in the search results.
 */
export default function RoomPin({ room }: Props) {
  const icon = getIcon(room);
  const hasGraphic = !!icon;
  const roomColors = getRoomTypeDetails(
    room.type == "Building" ? "Default" : room.type,
  );

  // TODO: Add selected room
  // const selectedRoom = useAppSelector((state) => state.ui.selectedRoom);
  // const isSelected = room.id === selectedRoom?.id;
  const isSelected = false;

  return (
    <div
      className={`flex items-center justify-center rounded ${isSelected ? "size-10" : "size-5"} `}
      style={{ background: roomColors.primary }}
    >
      <img
        alt={"Room Pin"}
        src={hasGraphic ? icon : pinIcon}
        className={`${isSelected ? "size-6" : "size-3"}`}
      />
    </div>
  );
}
