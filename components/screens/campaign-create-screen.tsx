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
  UploadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { API_URL } from "@/lib/api"

const { Title, Text } = Typography
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
  const [files, setFiles] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      const tgUserId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id

      if (!tgUserId) {
        message.error("Telegram user not found")
        return
      }

      if (creativeOption === "own" && files.length === 0) {
        message.error("Загрузите хотя бы один креатив")
        return
      }

      // берём первый файл как основной креатив
      const file = files[0]
      const mediaUrl = file.name

      // 1️⃣ создаём креатив (draft)
      const createRes = await fetch(
        `${API_URL}/advertiser/creatives`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-TG-USER-ID": String(tgUserId),
          },
          body: JSON.stringify({
            title: campaignName || "Без названия",
            type: creativeOption === "own" ? "video" : creativeType,
            media_url: mediaUrl,
            click_url: "https://example.com",
            duration: null,
          }),
        }
      )

      const createData = await createRes.json()

      if (!createData?.creative?.id) {
        throw new Error("creative create failed")
      }

      const creativeId = createData.creative.id

      // 2️⃣ отправляем креатив на модерацию
      const submitRes = await fetch(
        `${API_URL}/advertiser/creatives/${creativeId}/submit`,
        {
          method: "POST",
          headers: {
            "X-TG-USER-ID": String(tgUserId),
          },
        }
      )

      if (!submitRes.ok) {
        throw new Error("submit failed")
      }

      message.success("Креатив отправлен на модерацию")

      setTimeout(() => {
        router.push("/creatives")
      }, 1000)
    } catch (e) {
      console.error(e)
      message.error("Ошибка отправки на модерацию")
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    { title: "Основное" },
    { title: "Креативы" },
    { title: "Таргетинг" },
    { title: "Проверка" },
  ]

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            type="text"
            shape="circle"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          />
          <Title level={3}>Создание кампании</Title>
        </div>

        <Card>
          <Steps current={currentStep} items={steps} size="small" />
        </Card>

        {currentStep === 0 && (
          <Card>
            <Space direction="vertical" size={16}>
              <Input
                size="large"
                placeholder="Название кампании"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
              <InputNumber
                size="large"
                min={10}
                style={{ width: "100%" }}
                value={budget}
                onChange={(v) => setBudget(v || 100)}
                formatter={(v) => `${v} USDT`}
              />
            </Space>
          </Card>
        )}

        {currentStep === 1 && (
          <>
            <Card>
              <Radio.Group
                value={creativeOption}
                onChange={(e) =>
                  setCreativeOption(e.target.value)
                }
              >
                <Space direction="vertical">
                  <Radio value="own">Свои креативы</Radio>
                  <Radio value="order">Заказать</Radio>
                </Space>
              </Radio.Group>
            </Card>

            {creativeOption === "own" && (
              <Card>
                <Upload.Dragger
                  beforeUpload={() => false}
                  fileList={files}
                  onChange={({ fileList }) =>
                    setFiles(fileList)
                  }
                >
                  <UploadOutlined style={{ fontSize: 32 }} />
                  <p>Загрузите файлы</p>
                </Upload.Dragger>
              </Card>
            )}

            {creativeOption === "order" && (
              <Card>
                <Select
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="Тип креатива"
                  value={creativeType}
                  onChange={setCreativeType}
                  options={[
                    { value: "image", label: "Image" },
                    { value: "video", label: "Video" },
                  ]}
                />
                <TextArea
                  rows={5}
                  placeholder="ТЗ"
                  value={creativeBrief}
                  onChange={(e) =>
                    setCreativeBrief(e.target.value)
                  }
                />
              </Card>
            )}
          </>
        )}

        {currentStep === 2 && (
          <Card>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Целевая аудитория"
              value={targetAudience ? [targetAudience] : []}
              onChange={(v) => setTargetAudience(v[0] || "")}
              options={[
                { value: "business", label: "Бизнес" },
                { value: "crypto", label: "Крипто" },
              ]}
            />
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <Text>Проверьте данные и отправьте</Text>
          </Card>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          {currentStep > 0 && (
            <Button onClick={() => setCurrentStep(currentStep - 1)}>
              Назад
            </Button>
          )}
          {currentStep < 3 ? (
            <Button
              type="primary"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Далее
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              loading={submitting}
              onClick={handleSubmit}
            >
              Отправить на модерацию
            </Button>
          )}
        </div>
      </Space>
    </div>
  )
}
