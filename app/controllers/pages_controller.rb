class PagesController < ApplicationController
  skip_before_action :authenticate_user!

  def app
    render layout: "react"
  end
end
