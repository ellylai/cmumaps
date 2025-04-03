# Script to populate Track table using data from the file cmumaps-data/spring-carnival/carnival_events.json
# Run this script first before events.py!
# python scripts/json-to-database-carnival/tracks.py

from prisma import Prisma  # type: ignore
import asyncio
import json

prisma = Prisma()


async def drop_specified_tables(table_names):
    await prisma.connect()

    for table_name in table_names:
        try:
            # Truncate each table
            await prisma.query_raw(
                f'TRUNCATE TABLE "{table_name}" RESTART IDENTITY CASCADE'
            )
            print(f"Cleared table: {table_name}")
        except Exception as e:
            print(f"Error clearing table {table_name}: {e}")

    await prisma.disconnect()


async def create_tracks():
    await prisma.connect()

<<<<<<< Updated upstream
    tracks_set = {
=======
    tracks_set = [
>>>>>>> Stashed changes
        "CMU Tradition",
        "Food",
        "Awards/Celebration",
        "Exhibit/Tour",
        "Health/Wellness",
        "Alumni",
        "Performance",
<<<<<<< Updated upstream
    }
=======
    ]
>>>>>>> Stashed changes

    tracks_data = [{"trackName": track} for track in tracks_set]

    # Create all Tracks
    async with prisma.tx() as tx:
        await tx.track.create_many(data=tracks_data)

    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(drop_specified_tables(["Track"]))
    asyncio.run(create_tracks())
    print("Created table: Tracks")
