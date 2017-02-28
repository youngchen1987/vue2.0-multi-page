<template>
<div>
	<vhead></vhead>
	<vabout></vabout>
	<vfoot></vfoot>
</div>  
</template>

<script>
import vhead from '../../components/common/Head'
import vfoot from '../../components/common/Foot'
import vabout from '../../components/about/About'
export default {
	components: {
      // 可以以key-value的形式注册组件, 此时挂载点的名字就是key
      // 否则挂载点和组件名字一致, 即vhead
      vhead,
      vfoot,
      vabout
    }
}
</script>

<style>

</style>
