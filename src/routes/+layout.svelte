<script lang="ts">
  import "carbon-components-svelte/css/all.css";

  import {
    Column,
    Content,
    Grid,
    Header,
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    Row,
    SideNav,
    SideNavDivider,
    SideNavItems,
    SideNavLink,
    SideNavMenu,
    SideNavMenuItem,
    SkipToContent,
    Tabs,
    Tab,
    TabContent,
  } from "carbon-components-svelte";
  import Upload from "carbon-icons-svelte/lib/Upload.svelte";
  import Graph from "carbon-icons-svelte/lib/Network_2.svelte";

  import "./layout.css";

  const { children } = $props();

  let isSideNavOpen = $state(false);
</script>

<Header companyName="IBM" platformName="Carbon Svelte" bind:isSideNavOpen>
  <svelte:fragment slot="skipToContent">
    <SkipToContent />
  </svelte:fragment>
  <HeaderNav>
    <HeaderNavItem>
      <p>foo</p>
    </HeaderNavItem>
  </HeaderNav>
</Header>

<SideNav bind:isOpen={isSideNavOpen} rail>
  <SideNavItems>
    <SideNavLink icon={Upload} on:click={() => alert(1)}>Upload</SideNavLink>
    <SideNavLink icon={Graph} on:click={() => alert(1)}>DFA</SideNavLink>
    <SideNavLink icon={Graph} on:click={() => alert(1)}>PDA</SideNavLink>
    <SideNavLink icon={Graph} on:click={() => alert(1)}>
      Turing Machine
    </SideNavLink>
  </SideNavItems>
</SideNav>

<Content>
  <Grid>
    <Row>
      <Column>
        {@render children()}
      </Column>
    </Row>
  </Grid>
</Content>
