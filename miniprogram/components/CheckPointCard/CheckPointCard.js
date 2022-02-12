Component({
  lifetimes: {
    attached: function() {
      this.setData({
        isFinish: this.data.initIsFinish
      })
    }
  },
  properties: {
    checkPointId: { // CheckPoint的id
      type: String,
      value: ''
    },
    title: { // CheckPoint的标题
      type: String,
      value: '标题'
    },
    teamName: { // CheckPoint的标题
      type: String,
      value: '负责团队的名称'
    },
    details: { // CheckPoint的详细描述
      type: String,
      value: '检查点详情'
    },
    urgencyColor: { // 紧急程度的颜色
      type: String,
      value: '#000000'
    },
    ddl: { // CheckPoint的Ddl
      type: String,
      value: new Date()
    },
    initIsFinish: {// 用于设定初始完成状态
      type: Boolean,
      value: false
    },
    canChangeFinish: { // 是否能通过点击Checkbox改变完成状态
      type: Boolean,
      value: true
    }
  },
  data: {
    isFinish: false
  },
  methods: {
    _clickBody() {
      this.triggerEvent("clickBody", { checkPointId: this.data.checkPointId })
    },
    _clickCheckbox() {
      if (!this.data.canChangeFinish)
        return
      this.setData({
        isFinish: !this.data.isFinish
      })
      this.triggerEvent("clickCheckbox", {
        checkPointId: this.data.checkPointId,
        isFinish: this.data.isFinish
      })
    }
  }
})
