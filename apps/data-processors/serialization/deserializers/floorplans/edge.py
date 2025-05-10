# Script to populate Edge table of the database using all_graph.json
# excludes outside nodes, neighbors who are missing in node or out node, and
# edges whose in node or out node are missing a roomId
# python serialization/deserializers/floorplans/edge.py 
from prisma import Prisma  # type: ignore
import asyncio
import json

prisma = Prisma()


# Drop and populate Edge table
async def drop_edge_table():
    await prisma.connect()

    table_names = ["Edge"]

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

# Function to get outside rooms (so that we can ignore them when creating edges)
def get_outside_rooms():
    with open("cmumaps-data/floorplans/outside-graph.json", "r") as file:
        outside_data = json.load(file)

    outside_rooms = [outsideId for outsideId in outside_data]
    return outside_rooms

# Populate Edge table
async def create_edges(target_building=None, target_floor=None):
    await prisma.connect()

    file_path = "cmumaps-data/floorplans/all_graph.json"
    with open(file_path, "r") as file:
        data = json.load(file)

    outside_rooms = get_outside_rooms()

    edge_data = []

    for nodeId in data:
        if "neighbors" not in data[nodeId]:
            continue

        edges = data[nodeId]["neighbors"]
        for edge in edges:
            inNodeId = nodeId
            outNodeId = edge

            edge_node = {"inNodeId": inNodeId, "outNodeId": outNodeId}
            
            # Skip edges that lead nowhere
            if outNodeId not in data:
                continue
            # Skip edges that connect to the outside
            if inNodeId in outside_rooms or outNodeId in outside_rooms:
                continue
            # Skip edges where the incoming or outgoing node have no roomId
            if not data[nodeId]["roomId"] or not data[outNodeId]["roomId"]:
                continue

            edge_data.append(edge_node)

    # If target_building and/or target_floor specified, only populate those edges
    for node in edge_data:
        if target_building or target_floor:
            target_edges = []

            nodes = await prisma.query_raw(
                'SELECT "nodeId" FROM "Node" WHERE "buildingCode" = $1 AND "floorLevel" = $2;',
                target_building,
                target_floor,
            )
            # Extract nodeId values
            target_nodes = [node["nodeId"] for node in nodes]
            if node["inNodeId"] in target_nodes or node["outNodeId"] in target_nodes:
                target_edges.append(node)

            edge_data = target_edges

    # Sometimes will get prisma.engine.errors.UnprocessableEntityError (Ellyse got this error)
    # Then populate in batches if get this error
    batch_size = 30000

    for i in range(0, len(edge_data), batch_size):
        batch = edge_data[i : i + batch_size]

        async with prisma.tx() as tx:
            await tx.edge.create_many(data=batch)

    # If no UnprocessableEntityError, then can populate all at once (comment out above code)
    # async with prisma.tx() as tx:
    #     await tx.edge.create_many(data=edge_data)

    await prisma.disconnect()

# Drop and populate Edge table
if __name__ == "__main__":
    asyncio.run(drop_edge_table())
    asyncio.run(create_edges())
