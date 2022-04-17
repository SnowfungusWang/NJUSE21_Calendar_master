// components/TeamCard.js
Component({
  externalClasses: ['i-class'],

  options: {
    multipleSlots: true
  },

  properties: {
    full: {
      type: Boolean,
      value: false
    },
    thumb: {
      type: String,
      value: ''
    },
    teamId: {
      type: String,
      value: ''
    },
    teamName: {
      type: String,
      value: ''
    },
    memberList: {
      type: Array,
      value: []
    }
  },

  methods: {
    _onShow: function(){
      var myEventDetail = {teamId: this.data.teamId} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    }
  }
});