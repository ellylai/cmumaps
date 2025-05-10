# Script to extract text descriptions for Events table (not used in finalized population)
# python serialization/deserializers/spring-carnival/events_cleaning.py

from bs4 import BeautifulSoup  # type: ignore
from prisma import Prisma  # type: ignore
import asyncio

# Use BeautifulSoup library to extract text content from html content
def extract_description(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    text = soup.get_text(separator=" ", strip=True)
    # remove 'Note:' and everything that comes after it
    if "Note:" in text:
        text = text.split("Note:")[0].strip()
    text = text.replace(" .", ".")
    return text


prisma = Prisma()

# Extract descriptions
async def extract_event_descriptions():
    await prisma.connect()

    results = await prisma.query_raw('SELECT "eventId", "description" FROM "Events";')

    for result in results:
        original_description = result["description"]
        eventId = result["eventId"]

        extracted_description = extract_description(original_description)
        print(extracted_description)

        # Update the description using eventId as the identifier
        await prisma.event.update(
            where={"eventId": eventId}, data={"description": extracted_description}
        )
    print("Edited descriptions for Events table!")
    await prisma.disconnect()


if __name__ == "__main__":
    asyncio.run(extract_event_descriptions())
