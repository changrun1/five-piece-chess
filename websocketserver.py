import asyncio
import json;
import websockets
from websockets import serve

async def remove_empty_rooms():
    global rooms
    while True:
        await asyncio.sleep(60) 
        empty_rooms = []
        for room_number, clients in rooms.items():
            if not clients[0].open or not clients[1].open:
                empty_rooms.append(room_number)
        for room_number in empty_rooms:
            del rooms[room_number]
async def handle_websocket(websocket):
    global connected_clients, rooms
    connected_clients.append(websocket)
    if len(connected_clients) == 2:
        room = []
        for client in connected_clients:
            room.append(client)
        if room[0].open and room[1].open:
            await match_clients(room)
        else:
            if not room[0].open or not room[1].open:
                connected_clients.remove(room[0])
                connected_clients.remove(room[1])
    async for message in websocket:
        message_dict = json.loads(message)
        if message_dict["type"] == "move":
            if message_dict["player"] == 1:
                await rooms[message_dict["room_number"]][1].send(message)
            else:
                await rooms[message_dict["room_number"]][0].send(message)
        if message_dict["type"] == "restart":
            if message_dict["player"] == 1:
                await rooms[message_dict["room_number"]][1].send(message)
            else:
                await rooms[message_dict["room_number"]][0].send(message)

        

async def match_clients(room):
    global connected_clients, rooms
    client1, client2 = room
    message1 = {"type": "match_found", "player_number": 1, "room_number": len(rooms)+1}
    message2 = {"type": "match_found", "player_number": 2, "room_number": len(rooms)+1}
    rooms[len(rooms)+1] = [client1, client2]
    try:
        await client1.send(json.dumps(message1))
    except websockets.exceptions.ConnectionClosedError:
        pass
    try:
        await client2.send(json.dumps(message2))
    except websockets.exceptions.ConnectionClosedError:
        pass
    connected_clients = []





async def start_servers():
    global connected_clients, rooms
    print("server started on port 8765")
    connected_clients = list()
    rooms = {}
    asyncio.create_task(remove_empty_rooms())
    async with serve(handle_websocket, "0.0.0.0", 8765):
        await asyncio.Future()

def main():
    asyncio.run(start_servers())

if __name__ == "__main__":
    main()
