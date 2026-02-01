"use client"

import {
  Card,
  Button,
  Typography,
  Space,
  Input,
  Select,
  Radio,
  InputNumber,
  Upload,
  Steps,
  message,
} from "antd"
import {
  ArrowLeftOutlined,
  PlusOutlined,
  UploadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/api"


async function uploadToCloudinary(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  )

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  if (!res.ok) {
    throw new Error("Cloudinary upload failed")
  }

  const data = await res.json()
  return data.secure_url as string
}


const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

type CreativeOption = "own" | "order"

export function CampaignCreateScreen() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [creativeOption, setCreativeOption] =
    useState<CreativeOption>("own")
  const [campaignName, setCampaignName] = useState("")
  const [budget, setBudget] = useState<number>(100)
  const [targetAudience, setTargetAudience] = useState("")
  const [creativeType, setCreativeType] = useState("")
  const [creativeBrief, setCreativeBrief] = useState("")
  const [fileList, setFileList] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      const tg =
        window.Telegram?.WebApp
      const tgUserId =
        tg?.initDataUnsafe?.user?.id

      if (!tgUserId) {
        message.error("Не удалось определить Telegram пользователя")
        return
      }

      if (!campaignName?.trim()) {
        message.error("Введите название кампании")
        return
      }

      if (creativeOption === "own") {
        if (!fileList.length) {
          message.error("Загрузите креатив")
          return
        }
      }

      if (creativeOption === "order") {
        if (!creativeType) {
          message.error("Выберите тип креатива")
          return
        }
        if (!creativeBrief.trim()) {
          message.error("Заполните техническое задание")
          return
        }
      }


      let typeToSend = creativeType

      if (creativeOption === "own") {
        const file = fileList[0]?.originFileObj as File

        if (!file) {
        message.error("Файл не найден")
        return
      }

      if (file.type.startsWith("image/")) {
        typeToSend = "banner"
      } else if (file.type.startsWith("video/")) {
        typeToSend = "video"
      } else {
      message.error("Неподдерживаемый тип файла")
      return
    }
  }

      

      // ВАЖНО: без заглушек "uploaded_later" — отправляем то, что есть.
      // Сейчас у тебя нет загрузки файла на сервер, поэтому берём имя файла как media_url.
      // Это не мок-данные, а реальное значение, которое у тебя есть на фронте.
      let mediaUrlToSend = ""

      if (creativeOption === "own") {
        const file = fileList[0]?.originFileObj
        if (!file) {
          message.error("Файл не найден")
          return
        }

        mediaUrlToSend = await uploadToCloudinary(file)
      } else {
        mediaUrlToSend = `ORDER:${creativeType}`
      }


      const clickUrlToSend =
        "https://example.com"

      // 1) CREATE CREATIVE (draft)
      const createRes = await fetch(
        `${API_URL}/advertiser/creatives`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-TG-USER-ID": String(tgUserId),
          },
          body: JSON.stringify({
            title: campaignName.trim(),
            type: typeToSend,
            media_url: mediaUrlToSend,
            click_url: clickUrlToSend,
            duration: null,
          }),
        }
      )

      const createData = await createRes.json()

      if (!createRes.ok) {
        message.error(createData?.error || "Ошибка создания креатива")
        return
      }

      const creativeId = createData?.creative?.id
      if (!creativeId) {
        message.error("Бекенд не вернул creative_id")
        return
      }

      // 2) SUBMIT TO MODERATION => pending (АДМИНКА ВИДИТ)
      const submitRes = await fetch(
        `${API_URL}/advertiser/creatives/${creativeId}/submit`,
        {
          method: "POST",
          headers: {
            "X-TG-USER-ID": String(tgUserId),
          },
        }
      )

      const submitData = await submitRes.json().catch(() => ({}))

      if (!submitRes.ok) {
        message.error(submitData?.error || "Ошибка отправки на модерацию")
        return
      }

      message.success("Кампания отправлена на модерацию!")
      setTimeout(() => {
        router.push("/advertiser")
      }, 1500)
    } catch (e) {
      console.error(e)
      message.error("Ошибка отправки на модерацию")
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    { title: "Основное", description: "Название и бюджет" },
    { title: "Креативы", description: "Загрузка или заказ" },
    { title: "Настройки", description: "Таргетинг" },
    { title: "Проверка", description: "Подтверждение" },
  ]

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        paddingBottom: "100px",
      }}
    >
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Button
            type="text"
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          />
          <Title
            level={2}
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "24px",
            }}
          >
            Создание кампании
          </Title>
        </div>

        {/* Steps */}
        <Card>
          <Steps current={currentStep} items={steps} size="small" />
        </Card>

        {/* Step 0: Basic Info */}
        {currentStep === 0 && (
          <Card>
            <Space
              direction="vertical"
              size={16}
              style={{ width: "100%" }}
            >
              <div>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Название кампании
                </Text>
                <Input
                  size="large"
                  placeholder="Например: Новогодняя распродажа 2025"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>

              <div>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Бюджет кампании (USDT)
                </Text>
                <InputNumber
                  size="large"
                  style={{ width: "100%" }}
                  min={10}
                  max={100000}
                  value={budget}
                  onChange={(val) => setBudget(val || 100)}
                  formatter={(value) => `${value} USDT`}
                />
                <Text
                  type="secondary"
                  style={{
                    fontSize: "13px",
                    display: "block",
                    marginTop: "8px",
                  }}
                >
                  Минимальный бюджет: 10 USDT
                </Text>
              </div>

              <div>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Длительность
                </Text>
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  defaultValue="7"
                  options={[
                    { value: "3", label: "3 дня" },
                    { value: "7", label: "7 дней" },
                    { value: "14", label: "14 дней" },
                    { value: "30", label: "30 дней" },
                    { value: "custom", label: "Свой период" },
                  ]}
                />
              </div>
            </Space>
          </Card>
        )}

        {/* Step 1: Creatives */}
        {currentStep === 1 && (
          <>
            <Card>
              <Space
                direction="vertical"
                size={16}
                style={{ width: "100%" }}
              >
                <div>
                  <Text
                    strong
                    style={{
                      fontSize: "16px",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    Как вы хотите получить креативы?
                  </Text>
                  <Radio.Group
                    value={creativeOption}
                    onChange={(e) =>
                      setCreativeOption(e.target.value)
                    }
                    style={{ width: "100%" }}
                  >
                    <Space
                      direction="vertical"
                      size={12}
                      style={{ width: "100%" }}
                    >
                      <Radio value="own" style={{ width: "100%" }}>
                        <div>
                          <Text strong>У меня есть свои креативы</Text>
                          <Text
                            type="secondary"
                            style={{
                              fontSize: "13px",
                              display: "block",
                            }}
                          >
                            Загрузите готовые баннеры, видео или изображения
                          </Text>
                        </div>
                      </Radio>
                      <Radio value="order" style={{ width: "100%" }}>
                        <div>
                          <Text strong>Заказать у контент-отдела</Text>
                          <Text
                            type="secondary"
                            style={{
                              fontSize: "13px",
                              display: "block",
                            }}
                          >
                            Наша команда создаст креативы по вашему ТЗ
                          </Text>
                        </div>
                      </Radio>
                    </Space>
                  </Radio.Group>
                </div>
              </Space>
            </Card>

            {creativeOption === "own" && (
              <Card>
                <Space
                  direction="vertical"
                  size={16}
                  style={{ width: "100%" }}
                >
                  <Text strong>Загрузите креативы</Text>
                  <Upload.Dragger
                    multiple
                    listType="picture"
                    beforeUpload={() => false}
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined
                        style={{ fontSize: "48px", color: "#1677ff" }}
                      />
                    </p>
                    <p className="ant-upload-text">
                      Нажмите или перетащите файлы
                    </p>
                    <p className="ant-upload-hint">
                      Поддерживаются: JPG, PNG, MP4, GIF (макс. 10 МБ)
                    </p>
                  </Upload.Dragger>
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    💡 Рекомендуемые размеры: 1080x1080 для квадрата, 1920x1080
                    для видео
                  </Text>
                </Space>
              </Card>
            )}

            {creativeOption === "order" && (
              <Card style={{ background: "rgba(22, 119, 255, 0.05)" }}>
                <Space
                  direction="vertical"
                  size={16}
                  style={{ width: "100%" }}
                >
                  <div>
                    <Text
                      strong
                      style={{
                        fontSize: "16px",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Заказ креативов
                    </Text>
                    <Text type="secondary">
                      Заполните техническое задание для нашего контент-отдела
                    </Text>
                  </div>

                  <div>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Тип креатива
                    </Text>
                    <Select
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Выберите тип"
                      value={creativeType}
                      onChange={setCreativeType}
                      options={[
                        { value: "image", label: "Статичное изображение" },
                        { value: "video", label: "Видео-ролик (до 30 сек)" },
                        { value: "gif", label: "Анимация (GIF)" },
                        { value: "carousel", label: "Карусель изображений" },
                      ]}
                    />
                  </div>

                  <div>
                    <Text
                      strong
                      style={{
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Техническое задание
                    </Text>
                    <TextArea
                      rows={6}
                      placeholder="Опишите детально:&#10;- Что рекламируем (продукт/услуга)&#10;- Целевая аудитория&#10;- Ключевое сообщение&#10;- Желаемый стиль и цвета&#10;- Примеры креативов (ссылки)"
                      value={creativeBrief}
                      onChange={(e) =>
                        setCreativeBrief(e.target.value)
                      }
                    />
                  </div>

                  <Card size="small" style={{ background: "#fff" }}>
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text type="secondary">Стоимость разработки:</Text>
                        <Text strong style={{ fontSize: "16px" }}>
                          50 USDT
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text type="secondary">Срок изготовления:</Text>
                        <Text strong>2-3 рабочих дня</Text>
                      </div>
                    </Space>
                  </Card>

                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    💡 После оплаты с вами свяжется менеджер контент-отдела для
                    уточнения деталей
                  </Text>
                </Space>
              </Card>
            )}
          </>
        )}

        {/* Step 2: Targeting */}
        {currentStep === 2 && (
          <Card>
            <Space
              direction="vertical"
              size={16}
              style={{ width: "100%" }}
            >
              <div>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Целевая аудитория
                </Text>
                <Select
                  size="large"
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Выберите категории"
                  value={targetAudience ? [targetAudience] : []}
                  onChange={(val) => setTargetAudience(val[0] || "")}
                  options={[
                    { value: "crypto", label: "🪙 Криптовалюты" },
                    { value: "tech", label: "💻 Технологии" },
                    { value: "business", label: "💼 Бизнес" },
                    { value: "entertainment", label: "🎬 Развлечения" },
                    { value: "education", label: "📚 Образование" },
                  ]}
                />
              </div>

              <div>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  География
                </Text>
                <Select
                  size="large"
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Выберите страны"
                  options={[
                    { value: "ru", label: "🇷🇺 Россия" },
                    { value: "kz", label: "🇰🇿 Казахстан" },
                    { value: "ua", label: "🇺🇦 Украина" },
                    { value: "us", label: "🇺🇸 США" },
                    { value: "global", label: "🌍 Весь мир" },
                  ]}
                />
              </div>

              <div>
                <Text
                  strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Язык контента
                </Text>
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  defaultValue="ru"
                  options={[
                    { value: "ru", label: "Русский" },
                    { value: "en", label: "English" },
                    { value: "kk", label: "Қазақша" },
                  ]}
                />
              </div>
            </Space>
          </Card>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <>
            <Card>
              <Space
                direction="vertical"
                size={16}
                style={{ width: "100%" }}
              >
                <div>
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    Название кампании
                  </Text>
                  <Title level={5} style={{ margin: "4px 0", fontWeight: 600 }}>
                    {campaignName || "Без названия"}
                  </Title>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">Бюджет:</Text>
                  <Text strong style={{ fontSize: "16px" }}>
                    {budget} USDT
                  </Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">Креативы:</Text>
                  <Text strong>
                    {creativeOption === "own"
                      ? "Свои"
                      : "Заказ у контент-отдела"}
                  </Text>
                </div>
                {creativeOption === "order" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text type="secondary">Стоимость креативов:</Text>
                    <Text strong style={{ fontSize: "16px", color: "#faad14" }}>
                      +50 USDT
                    </Text>
                  </div>
                )}
              </Space>
            </Card>

            <Card style={{ background: "rgba(22, 119, 255, 0.05)" }}>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text strong style={{ fontSize: "16px" }}>
                    Итого к оплате:
                  </Text>
                  <Title level={3} style={{ margin: 0, color: "#1677ff" }}>
                    {budget + (creativeOption === "order" ? 50 : 0)} USDT
                  </Title>
                </div>
                <Text type="secondary" style={{ fontSize: "13px" }}>
                  Средства будут заморожены до прохождения модерации
                </Text>
              </Space>
            </Card>

            <Card>
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <Text strong>📋 Что дальше?</Text>
                <ol style={{ margin: 0, paddingLeft: "20px" }}>
                  <li>
                    <Text type="secondary">
                      Кампания отправится на модерацию (1-2 часа)
                    </Text>
                  </li>
                  <li>
                    <Text type="secondary">
                      Средства заморозятся на вашем балансе
                    </Text>
                  </li>
                  {creativeOption === "order" && (
                    <li>
                      <Text type="secondary">
                        Контент-отдел начнет работу над креативами
                      </Text>
                    </li>
                  )}
                  <li>
                    <Text type="secondary">
                      После одобрения кампания запустится автоматически
                    </Text>
                  </li>
                </ol>
              </Space>
            </Card>
          </>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          {currentStep > 0 && (
            <Button
              size="large"
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{ flex: 1 }}
              disabled={submitting}
            >
              Назад
            </Button>
          )}
          {currentStep < 3 ? (
            <Button
              type="primary"
              size="large"
              onClick={() => setCurrentStep(currentStep + 1)}
              style={{ flex: 1 }}
              disabled={submitting || (currentStep === 0 && !campaignName)}
            >
              Далее
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handleSubmit}
              style={{ flex: 1 }}
              loading={submitting}
            >
              Отправить на модерацию
            </Button>
          )}
        </div>
      </Space>
    </div>
  )
}
