# Script to format carnival coordinates in the (same) json file, cmumaps-data/spring-carnival/carnival_events.json
# Precondition: Room table is populated
# python serialization/deserializers/spring-carnival/format_carnival_coord.py

import json
from prisma import Prisma  # type: ignore
import asyncio

prisma = Prisma()

# Return a dictionary with roomName and their latitude and longitude, 
# extracted from the already-populated database.
# Abomination function because from the json file, 
# roomName is either a list[int] if the room is unnamed,
# or str of the roomName if the room has a name
async def roomname_abomination(events_dict: dict):
    await prisma.connect()

    for event_occ in events_dict.values():
        if "roomName" in event_occ and type(event_occ["roomName"]) == list:
            event_occ["latitude"] = event_occ["roomName"][0]
            event_occ["longitude"] = event_occ["roomName"][1]
        elif "roomName" in event_occ and type(event_occ["roomName"]) == str:
            roomName = event_occ["roomName"]
            if roomName == "":
                continue
            buildingCode, room_name = roomName.split("-")
            entry = await prisma.room.find_first(
                where={"buildingCode": buildingCode, "name": room_name},
            )
            event_occ["latitude"] = entry.labelLatitude
            event_occ["longitude"] = entry.labelLongitude
    await prisma.disconnect()
    return events_dict


if __name__ == "__main__":
    with open(
        "cmumaps-data/spring-carnival/carnival_events.json", "r", encoding="utf-8"
    ) as carnival_events: # Get carnival_events.json (with empty latitude and longitude)
        carnival_events_data = json.load(carnival_events)

    result_dict = asyncio.run(roomname_abomination(carnival_events_data))

    with open(
        "cmumaps-data/spring-carnival/carnival_events.json", "w", encoding="utf-8"
    ) as file: # Modify carnival_events.json to have correct latitude and longitude
        json.dump(result_dict, file, indent=4)
