require 'rails_helper'

RSpec.describe Notification, type: :model do
  let(:notification){create(:notification)}
  it "check payment methods" do
    notification.created_at
    notification.days
    expect(Notification.all.search("test")).should_not be_nil
  end
end
