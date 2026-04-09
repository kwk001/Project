# 页面案例规范

本规则文件记录了教学实训平台中的优秀页面案例，供后续开发参考。

---

## 案例1：教师端 - 我的课程页面

### 页面信息
- **页面路径**: `/teacher/courses`
- **文件位置**: `src/pages/teacher/courses/index.jsx`
- **页面类型**: 数据列表页（带统计卡片）
- **适用角色**: 教师

### 页面截图
![教师端课程页面](http://localhost:8080/teacher/courses)

### 页面结构

#### 1. 统计卡片区域
- **全部课程**: 24门，进度条75%，趋势+12%
- **进行中**: 8门，进度条33%，趋势+5%
- **已完成**: 16门，进度条67%，趋势-2%

**设计特点**:
- 卡片采用渐变背景（深色模式/浅色模式自适应）
- 数字带有动画效果（从0递增到目标值）
- 包含趋势指示器（上升/下降）
- 底部有进度条展示占比

#### 2. 筛选条件区域
- 可展开/收起
- 支持按课程名称搜索
- 支持按状态筛选（全部/进行中/已完成/未开始）
- 支持按分类筛选
- 支持按时间范围筛选（今天/本周/本月/本年/自定义）

#### 3. 功能按钮区域
- 新增课程（主按钮）
- 批量删除
- 下载模板
- 批量导入
- 批量导出

#### 4. 数据表格
| 字段 | 说明 | 样式特点 |
|------|------|----------|
| 序号 | 自动编号（01, 02...） | 灰色字体，居中对齐 |
| 课程名称 | 课程名称 + ID | 左侧带彩色图标（根据状态变色） |
| 状态 | 进行中/已完成/未开始 | 带图标的状态标签，圆角设计 |
| 学员人数 | 数字徽章 | 紫色背景徽章 |
| 更新人 | 姓名 | 带头像（首字母） |
| 更新时间 | 日期时间 | 带时钟图标 |
| 操作 | 查看/编辑/删除 | 图标按钮，悬停效果 |

### 代码亮点

#### 统计卡片动画
```jsx
// 数字动画状态
const [animatedValues, setAnimatedValues] = useState([0, 0, 0])
const [progressValues, setProgressValues] = useState([0, 0, 0])

// 数字动画函数
const animateNumbers = () => {
  const targets = [24, 8, 16]
  const progressTargets = [75, 33, 67]
  const duration = 1200
  const steps = 60
  const interval = duration / steps
  
  let step = 0
  const timer = setInterval(() => {
    step++
    const progress = step / steps
    const easeProgress = 1 - Math.pow(1 - progress, 3) // easeOutCubic
    
    setAnimatedValues(targets.map(target => Math.round(target * easeProgress)))
    setProgressValues(progressTargets.map(target => Math.round(target * easeProgress)))
    
    if (step >= steps) {
      clearInterval(timer)
      setAnimatedValues(targets)
      setProgressValues(progressTargets)
    }
  }, interval)
}
```

#### 状态标签渲染
```jsx
const statusConfig = {
  '进行中': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: <FireOutlined /> },
  '已完成': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircleOutlined /> },
  '未开始': { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', icon: <ClockCircleOutlined /> },
}
```

#### 课程名称带图标渲染
```jsx
render: (text, record) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: record.status === '进行中' 
        ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
        : 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      color: '#fff'
    }}>
      <BookOutlined />
    </div>
    <div>
      <div style={{ fontWeight: 600, color: theme.text.primary, fontSize: '15px' }}>{text}</div>
      <div style={{ fontSize: '12px', color: theme.text.secondary, marginTop: '2px' }}>ID: {record.key}</div>
    </div>
  </div>
)
```

### 使用场景
适用于需要展示数据列表并带有统计概览的页面，如：
- 课程管理
- 任务管理
- 项目管理
- 订单管理

### 复用建议
1. 统计卡片可直接复用，修改数据和颜色即可
2. 表格列配置可根据业务需求调整
3. 筛选条件可根据实际业务增减
4. 动画效果可增强用户体验，建议保留

---

## 案例2：登录页面

### 页面信息
- **页面路径**: `/login`
- **文件位置**: `src/pages/login/index.jsx`
- **页面类型**: 登录页
- **适用角色**: 所有用户

### 页面结构
- 左侧：平台介绍、特色功能卡片、统计数据
- 右侧：登录表单（用户名、密码、验证码、角色选择）

---

*更多案例持续添加中...*
