try:
    import iyzipay
    IYZIPAY_AVAILABLE = True
except ImportError:
    iyzipay = None
    IYZIPAY_AVAILABLE = False

from app.core.config import settings
from pydantic import BaseModel

options = {
    'api_key': settings.IYZICO_API_KEY,
    'secret_key': settings.IYZICO_SECRET_KEY,
    'base_url': settings.IYZICO_BASE_URL.replace('https://', '').replace('http://', '').strip('/') if settings.IYZICO_BASE_URL else 'sandbox-api.iyzipay.com'
}

class PaymentRequestData(BaseModel):
    price: str
    paidPrice: str
    currency: str = 'TRY'
    basketId: str
    paymentGroup: str = 'PRODUCT'
    buyer: dict
    shippingAddress: dict
    billingAddress: dict
    basketItems: list

def _check_iyzipay():
    if not IYZIPAY_AVAILABLE or iyzipay is None:
        raise RuntimeError("iyzipay modülü yüklenemedi. Ödeme sistemi devre dışı.")

def initialize_checkout_form(order_data: PaymentRequestData, callback_url: str):
    _check_iyzipay()
    request = {
        'locale': 'tr',
        'conversationId': order_data.basketId,
        'price': order_data.price,
        'paidPrice': order_data.paidPrice,
        'currency': order_data.currency,
        'basketId': order_data.basketId,
        'paymentGroup': order_data.paymentGroup,
        'callbackUrl': callback_url,
        'enabledInstallments': ['2', '3', '6', '9'],
        'buyer': order_data.buyer,
        'shippingAddress': order_data.shippingAddress,
        'billingAddress': order_data.billingAddress,
        'basketItems': order_data.basketItems
    }
    checkout_form_initialize = iyzipay.CheckoutFormInitialize().create(request, options)
    return checkout_form_initialize.read()

def retrieve_checkout_form_result(token: str):
    _check_iyzipay()
    request = {
        'locale': 'tr',
        'token': token
    }
    checkout_form_result = iyzipay.CheckoutForm().retrieve(request, options)
    return checkout_form_result.read()

def create_direct_payment(order_data: PaymentRequestData, card_info: dict, card_user_key: str = None, save_card: bool = False):
    _check_iyzipay()
    if 'card_token' in card_info and card_user_key:
        payment_card = {
            'cardToken': card_info['card_token'],
            'cardUserKey': card_user_key
        }
    else:
        payment_card = {
            'cardHolderName': card_info.get('card_holder_name'),
            'cardNumber': card_info.get('card_number'),
            'expireMonth': card_info.get('expire_month'),
            'expireYear': card_info.get('expire_year'),
            'cvc': card_info.get('cvc'),
            'registerCard': '1' if save_card else '0'
        }
        if card_user_key:
            payment_card['cardUserKey'] = card_user_key

    request = {
        'locale': 'tr',
        'conversationId': order_data.basketId,
        'price': order_data.price,
        'paidPrice': order_data.paidPrice,
        'currency': order_data.currency,
        'installment': '1',
        'basketId': order_data.basketId,
        'paymentChannel': 'WEB',
        'paymentGroup': order_data.paymentGroup,
        'paymentCard': payment_card,
        'buyer': order_data.buyer,
        'shippingAddress': order_data.shippingAddress,
        'billingAddress': order_data.billingAddress,
        'basketItems': order_data.basketItems
    }
    payment = iyzipay.Payment().create(request, options)
    return payment.read()

def list_user_cards(card_user_key: str):
    _check_iyzipay()
    request = {
        'locale': 'tr',
        'cardUserKey': card_user_key
    }
    card_list = iyzipay.CardList().retrieve(request, options)
    return card_list.read()

def delete_user_card(card_user_key: str, card_token: str):
    _check_iyzipay()
    request = {
        'locale': 'tr',
        'cardUserKey': card_user_key,
        'cardToken': card_token
    }
    card_delete = iyzipay.Card().delete(request, options)
    return card_delete.read()
