Rails.application.routes.draw do
  root :to => 'splash_page#index'
  get '/home', :to => 'home#index'
  resources :articles
  get '/products', :to => 'products#index'
  mount ShopifyApp::Engine, at: '/'
  post '/rails/active_storage/direct_uploads' => 'direct_uploads#create'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

end
