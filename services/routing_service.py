import math


def calculate_distance(lat1, lon1, lat2, lon2):  # calculate the distance
    R = 6371  # Earth radius in km

    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))

    return R * c


def find_current_station(route, user_lat, user_long):  # find current station
    min_dist = float("inf")
    current = None

    for station in route:
        station_id, stop_no, lat, lon = station
        dist = calculate_distance(
            user_lat, user_long, lat, lon
        )  # calls calculate_distance

        if dist < min_dist:
            min_dist = dist
            current = station

    if min_dist > 50:
        print("Min Dist",min_dist)
        print("Distance is too far") 
        return route[-1]

    return current


def find_next_station(route, current_station):  # find next station
    current_stop = current_station[1]

    for station in route:
        if station[1] == current_stop + 1:
            return station

    return current_station
