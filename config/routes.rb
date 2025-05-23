Rails.application.routes.draw do
  scope "(:locale)", locale: /en|uk/ do
    root "pages#app"
    devise_for :users, skip: :all

    scope :users do
      get "" => "users/users#current", as: :current_user
      
      devise_scope :user do
        post 'sign_in', to: 'users/sessions#create', as: :user_session
        delete 'sign_out', to: 'users/sessions#destroy', as: :destroy_user_session

        
        post '', to: 'users/registrations#create'
        patch '', to: 'users/registrations#update', as: :user_registration
        delete '', to: 'users/registrations#destroy'
      end
    end

    get "boards/all" => "boards#all"
    resources :boards, except: [:show, :new, :index] do
      member do

        get "one" => "boards#one"

        scope :member do
          get "current" => "members#current", as: :current_member
          get "others" => "members#others", as: :others_members
          patch "update_role/:member_id" => "members#update_role", as: :member_update_role
          post "add_to_board" => "members#add_to_board", as: :member_add_to_board
          delete "leave_board" => "members#leave_board", as: :member_leave_board
          post "accept_invite" => "members#accept_invite", as: :member_accept_invite
        end

        scope :content do
          get "get" => "board_content#get", as: :content_get
          post "save" => "board_content#save", as: :content_save
        end

      end
    end

    get '*path', to: 'pages#app', constraints: lambda { |req|
      !req.xhr? && req.format.html?
    }

    match '*unmatched', to: 'application#route_not_found', via: :all
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
