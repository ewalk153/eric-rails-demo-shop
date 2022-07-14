# frozen_string_literal: true

class AuthenticatedController < ApplicationController
  include ShopifyApp::EnsureAuthenticatedLinks
  include ShopifyApp::Authenticated

  before_action :set_shop_origin

  private

  def set_shop_origin
    @shop_origin = @current_shopify_session.shop
  end
end
