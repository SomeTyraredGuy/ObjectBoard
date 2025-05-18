module ApplicationHelper
  def frontend_translations_json
    locale_file = Rails.root.join("app", "javascript", "locales", "#{I18n.locale}.json")

    if File.exist?(locale_file)
      File.read(locale_file)
    else
      "{}"
    end
  end
end
