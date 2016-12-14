<template>
  <div class="container">

    <!-- Breadcrumb -->
    <div class="flex padding-bottom-2-1 fontFamily-body fontSize-base">
      <div class="col col-xs-12">
        <router-link
          :to="{ name: 'dashboard' }"
          tag="a"
          class="textTransform-uppercase"
          exact>Dashboard</router-link> / Haugaard (2012)
      </div>
    </div>

    <!-- Article title -->
    <div class="flex padding-bottom-4-1">
      <h1 class="col col-xs-12 col-md-10 fontWeight-normal">Intrinsic Versus Extrinsic Goal Contents in Self- Determination Theory: Another Look at the Quality of Academic Motivation</h1>
    </div>

    <!-- Article information -->
    <div class="flex">

      <!-- Left column -->
      <div class="col col-xs-12 col-md-3">

        <!-- Article details -->
        <div class="backgroundColor-brandLight padding-2-1 margin-bottom-2-1">
          <h5 class="padding-bottom">Article details</h5>
          <ul class="list">
            <li class="padding-bottom">12 pages (19-31)</li>
            <li class="padding-bottom">Cited by 906</li>
            <li class="padding-bottom">Educational Psychologist</li>
            <li class="padding-none">Taylor & Francis</li>
          </ul>
        </div>

        <!-- Article structure -->
        <div class="padding-2-1">
          <h5 class="padding-bottom">Table of contents</h5>
          <ul class="list">
            <li class="padding-bottom">Introduction: bringing the power debates together</li>
            <li class="padding-bottom">The first dimension of power</li>
            <li class="padding-bottom">The second dimension of power</li>
            <li class="padding-bottom">The third dimension of power</li>
            <li class="padding-bottom">Fourth dimension of power</li>
            <li class="padding-none">Conclusion</li>
          </ul>
        </div>
      </div>

      <!-- Right column -->
      <div class="article-meta col col-xs-12 col-md-9">

        <!-- Reading guide -->
        <h5 class="padding-bottom-2-1">Reading guide</h5>
        <p class="padding-bottom-4-1">Haugaard (2012) er både en gennemgang af fire magtdimensioner og et forsøg på at gentænke disse. Brug i første omgang denne artikel til at danne jer et overblik over det at tale om magt i dimensioner. Her er et link til en meget let gennemgang i en dansk udgave: <a href="http://www.fjernenaboer.dk/index.php?PID=168" target="_blank">http://www.fjernenaboer.dk/index.php?PID=168</a></p>

        <!-- Abstract -->
        <h5 class="padding-bottom-2-1">Abstract</h5>
        <p class="padding-bottom-4-1">In the literature, there have been two essentially contrasting views of power: one of power as domination, largely characterized as power over, and the other of power as empowerment, frequently theorized as power to. To date, the four (Lukes and Foucault) dimensions of power have been considered forms of domination. In this article it is argued that the processes of four-dimensional power also constitute the process of normatively desirable power, as emancipation. Key is the realization that structured power over has the potential to be positive-sum, rather than zero-sum; furthermore, that the exclusions of two-dimensional power also constitute the conditions of possibility for justice. The fact that normatively desirable power and domination are constituted through the same processes is not chance: the effectiveness of power as domination is parasitic upon power as emancipation.</p>
      </div>
    </div>

  </div>
</template>

<script>
  //import GridBlock from 'components/GridBlock'
  //export default {
  //  components: { 'grid-block': GridBlock }
  //}
</script>

<style lang="scss">
  @import '~styles/global';

  .article-meta {
    height: 100px;
  }
</style>
