"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/lib/products-context"
import { Download, Upload, RotateCcw } from "lucide-react"

export function SettingsPanel() {
  const { products, categories } = useProducts()

  const handleExport = () => {
    const data = {
      products,
      categories,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `digitalstore-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string)
            if (data.products && data.categories) {
              localStorage.setItem("digitalstore_products", JSON.stringify(data.products))
              localStorage.setItem("digitalstore_categories", JSON.stringify(data.categories))
              window.location.reload()
            } else {
              alert("Arquivo inválido. Certifique-se de importar um backup válido.")
            }
          } catch (error) {
            alert("Erro ao importar dados. Verifique o arquivo.")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleReset = () => {
    if (
      confirm(
        "ATENÇÃO: Isso irá apagar TODOS os produtos e categorias e restaurar os dados padrão. Esta ação não pode ser desfeita. Deseja continuar?",
      )
    ) {
      localStorage.removeItem("digitalstore_products")
      localStorage.removeItem("digitalstore_categories")
      window.location.reload()
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 border-border/50 bg-card">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Backup e Restauração</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Exporte seus dados para fazer backup ou importe dados de um backup anterior.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleExport} variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Exportar Dados
              </Button>
              <Button onClick={handleImport} variant="outline" className="gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                Importar Dados
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border/50 bg-card border-destructive/30">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-destructive">Zona de Perigo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Resetar a loja irá apagar todos os dados e restaurar os produtos padrão. Esta ação não pode ser desfeita.
            </p>
            <Button onClick={handleReset} variant="destructive" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Resetar Loja
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border/50 bg-card">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-2">Informações do Sistema</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total de Produtos:</span>
              <span className="ml-2 font-semibold text-primary">{products.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total de Categorias:</span>
              <span className="ml-2 font-semibold text-primary">{categories.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Produtos em Destaque:</span>
              <span className="ml-2 font-semibold text-primary">{products.filter((p) => p.featured).length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Armazenamento:</span>
              <span className="ml-2 font-semibold text-primary">localStorage</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
