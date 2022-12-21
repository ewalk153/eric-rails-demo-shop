class DirectUploadsController < ActiveStorage::DirectUploadsController
  include ShopifyApp::EnsureAuthenticatedLinks
  include ShopifyApp::Authenticated

  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token

  before_action :set_shop_origin

  private

  def set_shop_origin
    @shop_origin = @current_shopify_session.shop
  end
end
