module LocaleHelper
  def locales_selector
    content_tag(:div, class: "dropdown") do
      button_tag(I18n.t("locales.#{I18n.locale}"), class: "btn btn-secondary dropdown-toggle", type: "button",
                                                   data: { bs_toggle: "dropdown" }, aria: { expanded: false }) +
        content_tag(:ul, class: "dropdown-menu") do
          safe_join(available_locales.map do |name, locale|
            content_tag(:li) { link_to_locale(name, locale) }
          end)
        end
    end
  end

  private

  def available_locales
    I18n.available_locales.map { |locale| [I18n.t("locales.#{locale}"), locale] }
  end

  def link_to_locale(name, locale)
    new_path = url_for(request.params.merge(locale: locale))
    link_to name, new_path, class: "dropdown-item"
  end
end
