Rails.application.routes.draw do
  scope "(:locale)", locale: /en|uk/ do
    root "pages#app"
    devise_for :user

    scope "boards/:id" do
      scope "member" do
        get "current" => "members#current"
        get "others" => "members#others"
        patch "update_role/:member_id" => "members#update_role", as: "member_update_role"
        post "add_to_board" => "members#add_to_board"
      end
      scope "content" do
        get "get" => "board_content#get", as: "content_get"
        post "save" => "board_content#save", as: "content_save"
      end
    end
  end

  get '*path', to: 'pages#app', constraints: lambda { |req|
    !req.xhr? && req.format.html?
  }


  get "up" => "rails/health#show", as: :rails_health_check
end
