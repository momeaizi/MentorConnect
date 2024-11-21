import requests
from loguru import logger


def get_coordinates(city, country):
    """
    Get latitude and longitude from city and country using Nominatim (OpenStreetMap).
    """
    response = requests.get(
        'https://nominatim.openstreetmap.org/search',
        params={'q': f'{city}, {country}', 'format': 'json'}
    )
    data = response.json()
    if data:
        latitude = float(data[0]['lat'])
        longitude = float(data[0]['lon'])
        return {"latitude": latitude, "longitude": longitude, "city": city, "country": country}
    else:
        logger.warn("Location not found")
        return None


def get_city_and_country(latitude, longitude):
    """
    Get city and country from latitude and longitude using Nominatim (OpenStreetMap).
    """
    response = requests.get(
        'https://nominatim.openstreetmap.org/reverse',
        params={'lat': latitude, 'lon': longitude, 'format': 'json', 'addressdetails': 1}
    )
    data = response.json()
    if 'address' in data:
        city = data['address'].get('city') or data['address'].get('town') or data['address'].get('village')
        country = data['address'].get('country')
        return {"latitude": latitude, "longitude": longitude, "city": city, "country": country}
    else:
        logger.warn("Location not found")
        return None

