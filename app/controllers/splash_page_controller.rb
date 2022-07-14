class SplashPageController < ApplicationController
  include ShopifyApp::EmbeddedApp
  include ShopifyApp::RequireKnownShop
  include ShopifyApp::ShopAccessScopesVerification

  layout 'embedded_app'

  def index
    @shop_origin = current_shopify_domain
  end
end
