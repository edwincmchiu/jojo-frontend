import { useState } from 'react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Step1BasicInfo from './Step1_BasicInfo';
import Step2Audience from './Step2_Audience';
import Step3VenueBooking from './Step3_VenueBooking';
import { createEvent } from '../../api/event';

export default function CreateEventWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 核心 State: 對應 DB 的 EVENT table schema
  const [formData, setFormData] = useState({
    title: '',
    typeId: '',     // FK: TYPE
    content: '',
    capacity: 4,
    groupId: '',    // FK: GROUP (nullable)
    isOnCampus: true,  // 是否為校內場地
    venueId: '',    // FK: VENUE (校內場地)
    locationName: '', // 校外場地名稱
    date: new Date().toISOString().split('T')[0],
    selectedSlots: [] // Logic for booking
  });

  const nextStep = async () => {
    // Step 1 驗證：必須輸入標題和選擇類型
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        alert('請輸入活動標題');
        return;
      }
      if (!formData.typeId) {
        alert('請選擇活動類型');
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(c => c + 1);
    } else {
      setIsSubmitting(true);

      // 1. 建立一個 payload (包裹)，用來轉換資料格式
      const payload = {
        ...formData,
        Group_id: formData.groupId ? parseInt(formData.groupId, 10) : null,
        
        // 如果你的後端也需要 Title 大寫，這裡也可以順便修 (視你的後端而定)
        // Title: formData.title, 
      };

      console.log("準備送出的 Payload:", payload); // Debug 用，你可以按 F12 看 Console

      try {
        await createEvent(payload); // ⚠️ 這裡改傳 payload，而不是 formData
        setIsSubmitting(false);
        alert('活動建立成功！\n資料已寫入資料庫。');
      } catch (error) {
        console.error(error);
        setIsSubmitting(false);
        alert('發布失敗，請檢查後端 Console');
      }
      // === 修正結束 ===
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col relative font-sans text-brand-dark">
      <Header currentStep={currentStep} />

      <div className="flex-1 p-6 overflow-y-auto">
        {currentStep === 1 && <Step1BasicInfo formData={formData} setFormData={setFormData} />}
        {currentStep === 2 && <Step2Audience formData={formData} setFormData={setFormData} />}
        {currentStep === 3 && <Step3VenueBooking formData={formData} setFormData={setFormData} />}
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <Button variant={currentStep === 3 ? 'action' : 'primary'} onClick={nextStep} disabled={isSubmitting}>
          {isSubmitting ? '處理中...' : (currentStep === 3 ? '確認發布' : '下一步')}
        </Button>
        {currentStep > 1 && (
          <Button variant="secondary" className="mt-3" onClick={prevStep}>
            返回上一步
          </Button>
        )}
      </div>
    </div>
  );
}