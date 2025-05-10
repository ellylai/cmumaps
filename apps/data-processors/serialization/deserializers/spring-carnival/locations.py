# Script to populate Location table using data from the file cmumaps-data/spring-carnival/carnival_events.json
# python serialization/deserializers/spring-carnival/locations.py

from prisma import Prisma  # type: ignore
import asyncio
import json
from tracks import drop_specified_tables

prisma = Prisma()

# Populate Location table
async def create_locations():
    await prisma.connect()

    location_set = set()

    with open("cmumaps-data/spring-carnival/carnival_events.json", "r") as file:
        data = json.load(file)

    location_data = []
    for event in data:
        locationId = data[event]["locationId"]
        locationName = data[event]["locationName"]
        latitude = data[event]["latitude"]
        longitude = data[event]["longitude"]

        # Create Location entry
        location = {
            "locationId": locationId,
            "locationName": locationName,
        }
        # If latitude and longitude exist, add them to the database.
        if latitude != "" and longitude != "":
            location["latitude"] = latitude
            location["longitude"] = longitude
        # Only populate locations that have not been seen yet (locations should be unique)
        if locationId not in location_set:
            location_data.append(location)
            location_set.add(locationId)

    # Create all Location entries
    async with prisma.tx() as tx:
        await tx.location.create_many(data=location_data)
    await prisma.disconnect()


if __name__ == "__main__":
    # Drop Location table
    asyncio.run(drop_specified_tables(["Location"]))
    # Popualte Location table
    asyncio.run(create_locations())
    print("Created table: Location")
