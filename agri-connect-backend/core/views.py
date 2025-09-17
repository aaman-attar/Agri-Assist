from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Farmer
from .serializers import FarmerSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class FarmerLoginOrRegister(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        try:
            farmer = Farmer.objects.get(phone=phone)
            serializer = FarmerSerializer(farmer)
            return Response({'msg': 'Welcome back!', 'farmer': serializer.data})
        except Farmer.DoesNotExist:
            serializer = FarmerSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'msg': 'Farmer registered!', 'farmer': serializer.data}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# from rest_framework.decorators import api_view
# from rest_framework.response import Response

# @api_view(['GET'])
# def crop_prices(request):
#     data = [
#         {"crop": "Wheat", "market": "Pune Mandi", "price": 2300, "date": "2025-07-18"},
#         {"crop": "Rice", "market": "Kolhapur", "price": 2900, "date": "2025-07-18"},
#         {"crop": "Onion", "market": "Nashik", "price": 1400, "date": "2025-07-18"},
#         {"crop": "Sugarcane", "market": "Ahmednagar", "price": 2800, "date": "2025-07-18"},
#     ]
#     return Response(data)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import MarketPrice
from .serializers import MarketPriceSerializer

@api_view(['GET'])
def get_market_prices(request):
    crop = request.GET.get('crop')
    market = request.GET.get('market')

    prices = MarketPrice.objects.all()
    if crop:
        prices = prices.filter(crop__icontains=crop)
    if market:
        prices = prices.filter(market__icontains=market)

    serializer = MarketPriceSerializer(prices, many=True)
    return Response(serializer.data)

from rest_framework import generics
from .models import MarketplaceItem
from .serializers import MarketplaceItemSerializer

class MarketplaceListCreateView(generics.ListCreateAPIView):
    queryset = MarketplaceItem.objects.all().order_by('-date_posted')
    serializer_class = MarketplaceItemSerializer

class MarketplaceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MarketplaceItem.objects.all()
    serializer_class = MarketplaceItemSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import joblib
import os

@api_view(['POST'])
def predict_crop(request):
    try:
        # Get input data
        data = request.data
        soil = data.get('soil_type')
        temp = float(data.get('temperature'))
        rain = float(data.get('rainfall'))
        season = data.get('season')

        # Load model & encoders
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model = joblib.load(os.path.join(base_dir, 'crop_model.pkl'))
        le_soil = joblib.load(os.path.join(base_dir, 'le_soil.pkl'))
        le_season = joblib.load(os.path.join(base_dir, 'le_season.pkl'))
        le_crop = joblib.load(os.path.join(base_dir, 'le_crop.pkl'))

        # Transform inputs
        soil_encoded = le_soil.transform([soil])[0]
        season_encoded = le_season.transform([season])[0]

        # Predict
        features = [[soil_encoded, temp, rain, season_encoded]]
        crop_encoded = model.predict(features)[0]
        crop_name = le_crop.inverse_transform([crop_encoded])[0]

        return Response({"recommended_crop": crop_name})

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# core/views.py

from rest_framework import generics
from .models import QuickTip
from .serializers import QuickTipSerializer

class QuickTipListCreateView(generics.ListCreateAPIView):
    queryset = QuickTip.objects.all().order_by('-created_at')
    serializer_class = QuickTipSerializer

class QuickTipDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = QuickTip.objects.all()
    serializer_class = QuickTipSerializer
