class CustomDeviseFailureApp < Devise::FailureApp
  def respond
    self.status = 401
    self.content_type = "application/json"
    message = I18n.t("devise.failure.unauthenticated")
    self.response_body = { error: message }.to_json
  end
end
