import { SingleValue } from "react-select";
import { toast } from "react-toastify";

import {
  RoomInfo,
  Rooms,
  RoomType,
  RoomTypes,
} from "../../../../../shared/types";
import CopyIdRow from "../shared/CopyIdRow";
import TableLayout from "../shared/TableLayout";
import EditCell from "./EditCell";
import SelectTypeCell from "./SelectTypeCell";

interface Props {
  floorCode: string;
  roomId: string;
  rooms: Rooms;
}

const RoomInfoDisplay = ({ roomId, rooms }: Props) => {
  const room = rooms[roomId];

  const handleSaveHelper = async (roomInfo: RoomInfo) => {
    toast.error("Unimplemented!");
    console.log(roomInfo);
  };

  const renderEditNameRow = () => {
    const handleSaveName = async (editedValue: string | undefined) => {
      if (editedValue) {
        const newRoomInfo = { ...room, name: editedValue };
        handleSaveHelper(newRoomInfo);
      }
    };

    return (
      <tr>
        <td className="border pr-4 pl-4">Name</td>
        <EditCell
          property="name"
          value={room.name}
          handleSave={handleSaveName}
        />
      </tr>
    );
  };

  const renderEditTypeRow = () => {
    const handleChange =
      () =>
      async (
        newValue: SingleValue<{
          value: string | undefined;
          label: string | undefined;
        }>,
      ) => {
        if (newValue?.value && newValue?.value !== room.type) {
          const newRoomInfo = { ...room, type: newValue.value as RoomType };
          handleSaveHelper(newRoomInfo);
        }
      };

    return (
      <tr>
        <td className="border pr-4 pl-4">Type</td>
        <SelectTypeCell
          key={roomId}
          value={room.type}
          typeList={RoomTypes as readonly string[]}
          handleChange={handleChange}
        />
      </tr>
    );
  };

  return (
    <TableLayout>
      <CopyIdRow text="Room ID" id={roomId} />
      {renderEditNameRow()}
      {renderEditTypeRow()}
      {/* {renderEditAliasesRow()} */}
      {/* <RoomInfoButtons floorCode={floorCode} nodes={nodes} /> */}
    </TableLayout>
  );
};

export default RoomInfoDisplay;
